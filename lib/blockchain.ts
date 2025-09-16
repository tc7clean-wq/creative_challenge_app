// Blockchain and NFT Integration System
interface NFTMetadata {
  name: string
  description: string
  image: string
  attributes: Array<{
    trait_type: string
    value: string | number
  }>
  external_url?: string
  background_color?: string
  animation_url?: string
}

interface NFTCollection {
  id: string
  name: string
  symbol: string
  description: string
  image: string
  totalSupply: number
  mintPrice: string
  royalty: number
  creator: string
  contractAddress?: string
}

interface BlockchainConfig {
  network: 'ethereum' | 'polygon' | 'solana' | 'base'
  rpcUrl: string
  chainId: number
  currency: string
  gasPrice: string
  maxGasLimit: string
}

class BlockchainManager {
  private config: BlockchainConfig
  private web3: any
  private wallet: any

  constructor() {
    this.config = {
      network: 'polygon',
      rpcUrl: 'https://polygon-rpc.com',
      chainId: 137,
      currency: 'MATIC',
      gasPrice: '20000000000',
      maxGasLimit: '500000'
    }
  }

  // Initialize Web3 connection
  async initializeWeb3(): Promise<boolean> {
    try {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        this.web3 = new (window as any).Web3((window as any).ethereum)
        await (window as any).ethereum.request({ method: 'eth_requestAccounts' })
        this.wallet = await this.web3.eth.getAccounts()
        return true
      }
      return false
    } catch (error) {
      console.error('Web3 initialization failed:', error)
      return false
    }
  }

  // Create NFT collection
  async createCollection(collection: Omit<NFTCollection, 'id' | 'contractAddress'>): Promise<string> {
    try {
      // Deploy ERC-721 contract
      const contractCode = this.generateERC721Contract(collection)
      const contract = new this.web3.eth.Contract(contractCode.abi)
      
      const deployTx = contract.deploy({
        data: contractCode.bytecode,
        arguments: [
          collection.name,
          collection.symbol,
          collection.description,
          collection.image,
          collection.royalty * 100 // Convert to basis points
        ]
      })

      const deployedContract = await deployTx.send({
        from: this.wallet[0],
        gas: this.config.maxGasLimit
      })

      return deployedContract.options.address
    } catch (error) {
      console.error('Collection creation failed:', error)
      throw error
    }
  }

  // Mint NFT
  async mintNFT(
    contractAddress: string,
    to: string,
    tokenId: number,
    metadata: NFTMetadata
  ): Promise<string> {
    try {
      // Upload metadata to IPFS
      const metadataHash = await this.uploadToIPFS(metadata)
      
      // Mint NFT
      const contract = new this.web3.eth.Contract(this.getERC721ABI(), contractAddress)
      const mintTx = contract.methods.mint(to, tokenId, metadataHash)
      
      const receipt = await mintTx.send({
        from: this.wallet[0],
        gas: this.config.maxGasLimit
      })

      return receipt.transactionHash
    } catch (error) {
      console.error('NFT minting failed:', error)
      throw error
    }
  }

  // Transfer NFT
  async transferNFT(
    contractAddress: string,
    from: string,
    to: string,
    tokenId: number
  ): Promise<string> {
    try {
      const contract = new this.web3.eth.Contract(this.getERC721ABI(), contractAddress)
      const transferTx = contract.methods.transferFrom(from, to, tokenId)
      
      const receipt = await transferTx.send({
        from: this.wallet[0],
        gas: this.config.maxGasLimit
      })

      return receipt.transactionHash
    } catch (error) {
      console.error('NFT transfer failed:', error)
      throw error
    }
  }

  // Get NFT metadata
  async getNFTMetadata(contractAddress: string, tokenId: number): Promise<NFTMetadata> {
    try {
      const contract = new this.web3.eth.Contract(this.getERC721ABI(), contractAddress)
      const tokenURI = await contract.methods.tokenURI(tokenId).call()
      
      const response = await fetch(`https://ipfs.io/ipfs/${tokenURI}`)
      return await response.json()
    } catch (error) {
      console.error('Failed to get NFT metadata:', error)
      throw error
    }
  }

  // Get user's NFTs
  async getUserNFTs(userAddress: string): Promise<Array<{
    contractAddress: string
    tokenId: number
    metadata: NFTMetadata
  }>> {
    try {
      // This would integrate with OpenSea API or similar
      const response = await fetch(
        `https://api.opensea.io/api/v1/assets?owner=${userAddress}&order_direction=desc&offset=0&limit=50`
      )
      const data = await response.json()
      
      return data.assets.map((asset: any) => ({
        contractAddress: asset.asset_contract.address,
        tokenId: parseInt(asset.token_id),
        metadata: {
          name: asset.name,
          description: asset.description,
          image: asset.image_url,
          attributes: asset.traits.map((trait: any) => ({
            trait_type: trait.trait_type,
            value: trait.value
          })),
          external_url: asset.external_link
        }
      }))
    } catch (error) {
      console.error('Failed to get user NFTs:', error)
      return []
    }
  }

  // Create marketplace listing
  async createMarketplaceListing(
    contractAddress: string,
    tokenId: number,
    price: string,
    currency: string = 'ETH'
  ): Promise<string> {
    try {
      // This would integrate with OpenSea or create custom marketplace
      const listing = {
        contractAddress,
        tokenId,
        price,
        currency,
        seller: this.wallet[0],
        timestamp: Date.now()
      }

      // Store listing in database
      const response = await fetch('/api/marketplace/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(listing)
      })

      return await response.text()
    } catch (error) {
      console.error('Marketplace listing failed:', error)
      throw error
    }
  }

  // Buy NFT
  async buyNFT(
    contractAddress: string,
    tokenId: number,
    price: string
  ): Promise<string> {
    try {
      const contract = new this.web3.eth.Contract(this.getERC721ABI(), contractAddress)
      
      // Transfer payment
      const paymentTx = this.web3.eth.sendTransaction({
        from: this.wallet[0],
        to: contractAddress,
        value: this.web3.utils.toWei(price, 'ether')
      })

      // Transfer NFT
      const transferTx = contract.methods.transferFrom(
        contractAddress,
        this.wallet[0],
        tokenId
      )

      const receipt = await transferTx.send({
        from: this.wallet[0],
        gas: this.config.maxGasLimit
      })

      return receipt.transactionHash
    } catch (error) {
      console.error('NFT purchase failed:', error)
      throw error
    }
  }

  // Get wallet balance
  async getWalletBalance(): Promise<string> {
    try {
      const balance = await this.web3.eth.getBalance(this.wallet[0])
      return this.web3.utils.fromWei(balance, 'ether')
    } catch (error) {
      console.error('Failed to get wallet balance:', error)
      return '0'
    }
  }

  // Connect wallet
  async connectWallet(): Promise<string> {
    try {
      await this.initializeWeb3()
      return this.wallet[0]
    } catch (error) {
      console.error('Wallet connection failed:', error)
      throw error
    }
  }

  // Disconnect wallet
  disconnectWallet(): void {
    this.wallet = null
    this.web3 = null
  }

  private async uploadToIPFS(metadata: NFTMetadata): Promise<string> {
    try {
      const response = await fetch('/api/ipfs/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(metadata)
      })
      
      const { hash } = await response.json()
      return hash
    } catch (error) {
      console.error('IPFS upload failed:', error)
      throw error
    }
  }

  private generateERC721Contract(collection: Omit<NFTCollection, 'id' | 'contractAddress'>): {
    abi: any[]
    bytecode: string
  } {
    // Simplified ERC-721 contract
    return {
      abi: [
        {
          "inputs": [
            {"internalType": "string", "name": "name", "type": "string"},
            {"internalType": "string", "name": "symbol", "type": "string"},
            {"internalType": "string", "name": "description", "type": "string"},
            {"internalType": "string", "name": "image", "type": "string"},
            {"internalType": "uint256", "name": "royalty", "type": "uint256"}
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "inputs": [
            {"internalType": "address", "name": "to", "type": "address"},
            {"internalType": "uint256", "name": "tokenId", "type": "uint256"},
            {"internalType": "string", "name": "uri", "type": "string"}
          ],
          "name": "mint",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [
            {"internalType": "uint256", "name": "tokenId", "type": "uint256"}
          ],
          "name": "tokenURI",
          "outputs": [
            {"internalType": "string", "name": "", "type": "string"}
          ],
          "stateMutability": "view",
          "type": "function"
        }
      ],
      bytecode: "0x608060405234801561001057600080fd5b50600436106100365760003560e01c8063095ea7b31461003b57806318160ddd14610057575b600080fd5b610055600480360381019061005091906101a4565b610075565b005b61005f61008b565b60405161006c91906101e0565b60405180910390f35b61007d610091565b6100878282610099565b5050565b60008054905090565b50565b600080fd5b600080fd5b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6100f1826100a8565b810181811067ffffffffffffffff821117156101105761010f6100b9565b5b80604052505050565b600061012361008a565b905061012f82826100e8565b919050565b600067ffffffffffffffff82111561014f5761014e6100b9565b5b610158826100a8565b9050602081019050919050565b60005b83811015610183578082015181840152602081019050610168565b60008484015250505050565b60006101a261019d84610134565b610119565b9050828152602081018484840111156101be576101bd6100a3565b5b6101c9848285610165565b509392505050565b600082601f8301126101e6576101e561009e565b5b81356101f684826020860161018f565b91505092915050565b60006020828403121561021557610214610094565b5b600082013567ffffffffffffffff81111561023357610232610099565b5b61023f848285016101d1565b91505092915050565b600081519050919050565b600082825260208201905092915050565b60005b8381101561027f578082015181840152602081019050610264565b60008484015250505050565b600061029682610248565b6102a08185610253565b93506102b0818560208601610261565b6102b9816100a8565b840191505092915050565b600060208201905081810360008301526102de818461028b565b90509291505056fea2646970667358221220..."
    }
  }

  private getERC721ABI(): any[] {
    return [
      {
        "inputs": [
          {"internalType": "address", "name": "to", "type": "address"},
          {"internalType": "uint256", "name": "tokenId", "type": "uint256"},
          {"internalType": "string", "name": "uri", "type": "string"}
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {"internalType": "address", "name": "from", "type": "address"},
          {"internalType": "address", "name": "to", "type": "address"},
          {"internalType": "uint256", "name": "tokenId", "type": "uint256"}
        ],
        "name": "transferFrom",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {"internalType": "uint256", "name": "tokenId", "type": "uint256"}
        ],
        "name": "tokenURI",
        "outputs": [
          {"internalType": "string", "name": "", "type": "string"}
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ]
  }
}

// Global blockchain manager
export const blockchain = new BlockchainManager()

// React hook for blockchain features
export function useBlockchain() {
  const [isConnected, setIsConnected] = React.useState(false)
  const [walletAddress, setWalletAddress] = React.useState<string | null>(null)
  const [balance, setBalance] = React.useState('0')

  const connectWallet = async () => {
    try {
      const address = await blockchain.connectWallet()
      setWalletAddress(address)
      setIsConnected(true)
      
      const walletBalance = await blockchain.getWalletBalance()
      setBalance(walletBalance)
    } catch (error) {
      console.error('Wallet connection failed:', error)
    }
  }

  const disconnectWallet = () => {
    blockchain.disconnectWallet()
    setWalletAddress(null)
    setIsConnected(false)
    setBalance('0')
  }

  const mintNFT = async (contractAddress: string, to: string, tokenId: number, metadata: NFTMetadata) => {
    return await blockchain.mintNFT(contractAddress, to, tokenId, metadata)
  }

  const getUserNFTs = async (userAddress: string) => {
    return await blockchain.getUserNFTs(userAddress)
  }

  return {
    isConnected,
    walletAddress,
    balance,
    connectWallet,
    disconnectWallet,
    mintNFT,
    getUserNFTs
  }
}

export type { NFTMetadata, NFTCollection, BlockchainConfig }
