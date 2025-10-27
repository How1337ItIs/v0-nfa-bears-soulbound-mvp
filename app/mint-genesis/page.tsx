'use client'

import { useState, useEffect } from 'react'
import {
  ThirdwebProvider,
  ConnectWallet,
  Web3Button,
  useContract,
  useContractRead,
  useAddress,
  useChainId,
  useSwitchChain,
} from "@thirdweb-dev/react"
import { Berachain } from "@thirdweb-dev/chains"
import { ethers } from "ethers"

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_GENESIS_BEARS_CONTRACT || ""
const THIRDWEB_CLIENT_ID = process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID || ""
const BASE_PRICE = "333"
const MAX_SUPPLY = 710
const GIFT_BOX_THRESHOLD = 100

// Berachain Bepolia configuration
const bepoliaChain = {
  ...Berachain,
  chainId: 80069,
  rpc: ["https://bepolia.rpc.berachain.com/"],
  nativeCurrency: {
    name: "BERA",
    symbol: "BERA",
    decimals: 18,
  },
  testnet: true,
  name: "Berachain Bepolia Testnet",
}

export default function MintGenesisPage() {
  return (
    <ThirdwebProvider
      activeChain={bepoliaChain}
      clientId={THIRDWEB_CLIENT_ID}
      supportedChains={[bepoliaChain]}
    >
      <MintPageContent />
    </ThirdwebProvider>
  )
}

function MintPageContent() {
  const address = useAddress()
  const chainId = useChainId()
  const switchChain = useSwitchChain()
  const { contract } = useContract(CONTRACT_ADDRESS)

  const [discountCode, setDiscountCode] = useState('')
  const [finalPrice, setFinalPrice] = useState(BASE_PRICE)
  const [appliedDiscount, setAppliedDiscount] = useState(0)
  const [isCheckingCode, setIsCheckingCode] = useState(false)
  const [quantity, setQuantity] = useState(1)

  // Read contract state
  const { data: totalSupply } = useContractRead(contract, "totalSupply")
  const minted = totalSupply ? totalSupply.toNumber() : 0
  const remaining = MAX_SUPPLY - minted
  const boxesRemaining = Math.max(0, GIFT_BOX_THRESHOLD - minted)
  const isWrongNetwork = chainId !== 80069

  // Calculate final price based on quantity
  useEffect(() => {
    const baseTotal = parseFloat(BASE_PRICE) * quantity
    const discountedTotal = baseTotal * (1 - appliedDiscount / 100)
    setFinalPrice(discountedTotal.toFixed(2))
  }, [quantity, appliedDiscount])

  // Check discount code
  const checkDiscountCode = async () => {
    if (!contract || !discountCode.trim()) {
      alert('Please enter a discount code')
      return
    }

    setIsCheckingCode(true)
    try {
      // Hash the code to check on-chain
      const codeHash = ethers.utils.keccak256(
        ethers.utils.toUtf8Bytes(discountCode.toUpperCase())
      )

      const discountPercent = await contract.call("discountPercents", [codeHash])
      const discount = discountPercent.toNumber()

      if (discount > 0) {
        // Check if user already used a discount
        const hasUsed = await contract.call("hasUsedDiscount", [address])

        if (hasUsed) {
          alert('You have already used a discount code')
        } else {
          setAppliedDiscount(discount)
          alert(`✓ ${discount}% discount applied!`)
        }
      } else {
        alert('Invalid discount code')
      }
    } catch (error) {
      console.error('Error checking code:', error)
      alert('Invalid discount code')
    } finally {
      setIsCheckingCode(false)
    }
  }

  const handleMintSuccess = () => {
    // Check if user should fill out shipping form
    if (minted < GIFT_BOX_THRESHOLD) {
      window.location.href = `/shipping/${minted + 1}`
    } else {
      alert('Successfully minted! Check your wallet.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            🐻 Genesis Bears
          </h1>
          <p className="text-2xl text-purple-200">
            By Pixelw00k | {MAX_SUPPLY} Unique NFTs
          </p>
          <p className="text-4xl font-bold text-yellow-300 mt-4">
            ${finalPrice} {quantity > 1 && `(${quantity} Bears)`}
          </p>
        </div>

        {/* Supply Counter */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-white/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-white text-lg font-semibold">Minted</span>
            <span className="text-white text-3xl font-bold">{minted}/{MAX_SUPPLY}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500"
              style={{ width: `${(minted / MAX_SUPPLY) * 100}%` }}
            />
          </div>
          {boxesRemaining > 0 && (
            <p className="text-yellow-300 font-bold text-center mt-4 text-lg animate-pulse">
              🎁 Only {boxesRemaining} gift boxes remaining!
            </p>
          )}
        </div>

        {/* Wrong Network Warning */}
        {address && isWrongNetwork && (
          <div className="bg-red-500/20 backdrop-blur-lg rounded-2xl p-6 mb-8 border border-red-500/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white font-bold text-lg">⚠️ Wrong Network</p>
                <p className="text-white/80">Please switch to Berachain Bepolia testnet</p>
              </div>
              <button
                onClick={() => switchChain(80069)}
                className="bg-white text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-50 transition-all"
              >
                Switch Network
              </button>
            </div>
          </div>
        )}

        {/* Main Mint Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 mb-8">

          {/* Discount Code Section */}
          <div className="mb-8">
            <label className="block text-white font-semibold mb-3 text-lg">
              Have a discount code?
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                placeholder="ENTER CODE"
                className="flex-1 px-4 py-3 bg-white/20 text-white placeholder-white/50 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button
                onClick={checkDiscountCode}
                disabled={isCheckingCode || !address}
                className="px-8 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCheckingCode ? 'Checking...' : 'Apply'}
              </button>
            </div>
            {appliedDiscount > 0 && (
              <p className="text-green-400 font-semibold mt-3 text-lg">
                ✓ {appliedDiscount}% discount applied!
                {appliedDiscount === 25 && ' 🌟 OG Bear!'}
                {appliedDiscount === 20 && ' 💎 Early Supporter!'}
                {appliedDiscount === 15 && ' 🍯 Honey Jar Partner!'}
                {appliedDiscount === 10 && ' 🎪 Pilot Event Attendee!'}
              </p>
            )}
          </div>

          {/* Quantity Selector */}
          <div className="mb-8">
            <label className="block text-white font-semibold mb-3 text-lg">
              Quantity (max 3 per transaction)
            </label>
            <div className="flex gap-3">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  onClick={() => setQuantity(num)}
                  className={`flex-1 py-4 rounded-xl font-bold text-xl transition-all ${
                    quantity === num
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          {/* Purchase Options */}
          <div className="space-y-4">

            {/* Option 1: Buy with Card */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/20">
              <h3 className="text-white font-bold text-xl mb-4">💳 Buy with Credit/Debit Card</h3>
              <Web3Button
                contractAddress={CONTRACT_ADDRESS}
                action={(contract) =>
                  contract.call("claim", [
                    address,
                    quantity,
                    discountCode.toUpperCase() || ""
                  ], {
                    value: ethers.utils.parseEther((parseFloat(finalPrice) / quantity).toString())
                  })
                }
                onSuccess={handleMintSuccess}
                onError={(error) => {
                  console.error(error)
                  alert('Mint failed: ' + error.message)
                }}
                className="!w-full !bg-gradient-to-r !from-purple-600 !to-pink-600 !text-white !font-bold !py-4 !rounded-xl hover:!from-purple-700 hover:!to-pink-700 !transition-all"
                contractAbi={[
                  {
                    "inputs": [
                      {"internalType": "address", "name": "_receiver", "type": "address"},
                      {"internalType": "uint256", "name": "_quantity", "type": "uint256"},
                      {"internalType": "string", "name": "_discountCode", "type": "string"}
                    ],
                    "name": "claim",
                    "outputs": [],
                    "stateMutability": "payable",
                    "type": "function"
                  }
                ]}
              >
                Buy for ${finalPrice}
              </Web3Button>
              <p className="text-white/60 text-sm mt-3 text-center">
                No wallet needed - we'll create one for you
              </p>
            </div>

            {/* Option 2: Buy with Crypto Wallet */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/20">
              <h3 className="text-white font-bold text-xl mb-4">🦊 Buy with Crypto Wallet</h3>
              {!address ? (
                <ConnectWallet
                  className="!w-full !bg-blue-600 !text-white !font-bold !py-4 !rounded-xl"
                />
              ) : (
                <Web3Button
                  contractAddress={CONTRACT_ADDRESS}
                  action={(contract) =>
                    contract.call("claim", [
                      address,
                      quantity,
                      discountCode.toUpperCase() || ""
                    ], {
                      value: ethers.utils.parseEther((parseFloat(finalPrice) / quantity).toString())
                    })
                  }
                  onSuccess={handleMintSuccess}
                  onError={(error) => {
                    console.error(error)
                    alert('Mint failed: ' + error.message)
                  }}
                  className="!w-full !bg-gradient-to-r !from-blue-600 !to-indigo-600 !text-white !font-bold !py-4 !rounded-xl hover:!from-blue-700 hover:!to-indigo-700 !transition-all"
                  contractAbi={[
                    {
                      "inputs": [
                        {"internalType": "address", "name": "_receiver", "type": "address"},
                        {"internalType": "uint256", "name": "_quantity", "type": "uint256"},
                        {"internalType": "string", "name": "_discountCode", "type": "string"}
                      ],
                      "name": "claim",
                      "outputs": [],
                      "stateMutability": "payable",
                      "type": "function"
                    }
                  ]}
                >
                  Mint {quantity} Genesis Bear{quantity > 1 ? 's' : ''}
                </Web3Button>
              )}
              <p className="text-white/60 text-sm mt-3 text-center">
                MetaMask, Coinbase Wallet, WalletConnect supported
              </p>
            </div>

            {/* Option 3: Cross-Chain Purchase */}
            <div className="bg-white/5 rounded-xl p-6 border border-white/20">
              <h3 className="text-white font-bold text-xl mb-4">🌉 Buy from ETH/Base/Polygon</h3>
              <Web3Button
                contractAddress={CONTRACT_ADDRESS}
                action={(contract) =>
                  contract.call("claim", [
                    address,
                    quantity,
                    discountCode.toUpperCase() || ""
                  ], {
                    value: ethers.utils.parseEther((parseFloat(finalPrice) / quantity).toString())
                  })
                }
                onSuccess={handleMintSuccess}
                onError={(error) => {
                  console.error(error)
                  alert('Mint failed: ' + error.message)
                }}
                className="!w-full !bg-gradient-to-r !from-green-600 !to-teal-600 !text-white !font-bold !py-4 !rounded-xl hover:!from-green-700 hover:!to-teal-700 !transition-all"
                contractAbi={[
                  {
                    "inputs": [
                      {"internalType": "address", "name": "_receiver", "type": "address"},
                      {"internalType": "uint256", "name": "_quantity", "type": "uint256"},
                      {"internalType": "string", "name": "_discountCode", "type": "string"}
                    ],
                    "name": "claim",
                    "outputs": [],
                    "stateMutability": "payable",
                    "type": "function"
                  }
                ]}
              >
                Buy from Other Chain
              </Web3Button>
              <p className="text-white/60 text-sm mt-3 text-center">
                Automatically bridges from Ethereum, Base, Polygon, etc.
              </p>
            </div>
          </div>
        </div>

        {/* Gift Box Details */}
        {boxesRemaining > 0 && (
          <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-2xl p-8 border-2 border-yellow-400/50 mb-8">
            <h3 className="text-white font-bold text-2xl mb-4 text-center">
              🎁 First 100 Buyers Get Gift Box:
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-white">
                <span className="text-3xl">📿</span>
                <span className="text-lg">Sterling Silver NFA Bears Pendant</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <span className="text-3xl">👕</span>
                <span className="text-lg">Hand-Dyed Premium T-Shirt</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <span className="text-3xl">🎨</span>
                <span className="text-lg">Exclusive Sticker Pack</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <span className="text-3xl">📜</span>
                <span className="text-lg">Numbered Certificate (1-100)</span>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h3 className="text-white font-bold text-xl mb-4">📋 How It Works:</h3>
          <ol className="text-white/90 space-y-3 text-lg list-decimal list-inside">
            <li>Enter your discount code (if you have one)</li>
            <li>Choose quantity (1-3 bears)</li>
            <li>Select payment method (card, crypto wallet, or cross-chain)</li>
            <li>Complete purchase</li>
            <li>If you're in the first 100, you'll be redirected to enter shipping info</li>
            <li>Welcome to the Genesis Bears family! 🐻</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
