'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function ShippingForm() {
  const params = useParams()
  const router = useRouter()
  const tokenId = params.tokenId as string

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: 'USA',
    shirtSize: 'L'
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokenId,
          ...formData
        })
      })

      if (response.ok) {
        alert('🎁 Shipping info saved! Your gift box will ship within 2-4 weeks.')
        router.push('/success')
      } else {
        alert('Error saving shipping info. Please try again.')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error saving shipping info. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🎁</div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Gift Box Shipping Info
          </h1>
          <p className="text-xl text-purple-200">
            Congratulations! You're one of the first 100.
          </p>
          <p className="text-lg text-white/80 mt-2">
            Token ID: <span className="font-mono font-bold">#{tokenId}</span>
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-yellow-500/20 backdrop-blur-lg rounded-2xl p-6 mb-8 border-2 border-yellow-400/50">
          <h3 className="text-white font-bold text-lg mb-3">Your Gift Box Includes:</h3>
          <ul className="text-white space-y-2">
            <li>📿 Sterling Silver NFA Bears Pendant</li>
            <li>👕 Hand-Dyed Premium T-Shirt</li>
            <li>🎨 Exclusive Sticker Pack</li>
            <li>📜 Numbered Certificate (1-100)</li>
          </ul>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <div className="space-y-6">

            {/* Name */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Full Name *
              </label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/40 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Email Address *
              </label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="john@example.com"
                className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/40 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Street Address *
              </label>
              <input
                required
                type="text"
                value={formData.address}
                onChange={(e) => updateField('address', e.target.value)}
                placeholder="123 Main St"
                className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/40 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* Address 2 */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Apartment, Suite, etc. (Optional)
              </label>
              <input
                type="text"
                value={formData.address2}
                onChange={(e) => updateField('address2', e.target.value)}
                placeholder="Apt 4B"
                className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/40 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* City, State, ZIP */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-white font-semibold mb-2">
                  City *
                </label>
                <input
                  required
                  type="text"
                  value={formData.city}
                  onChange={(e) => updateField('city', e.target.value)}
                  placeholder="San Francisco"
                  className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/40 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  State *
                </label>
                <input
                  required
                  type="text"
                  value={formData.state}
                  onChange={(e) => updateField('state', e.target.value)}
                  placeholder="CA"
                  maxLength={2}
                  className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/40 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold mb-2">
                ZIP Code *
              </label>
              <input
                required
                type="text"
                value={formData.zip}
                onChange={(e) => updateField('zip', e.target.value)}
                placeholder="94102"
                className="w-full px-4 py-3 bg-white/20 text-white placeholder-white/40 border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-white font-semibold mb-2">
                Country *
              </label>
              <select
                required
                value={formData.country}
                onChange={(e) => updateField('country', e.target.value)}
                className="w-full px-4 py-3 bg-white/20 text-white border border-white/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="USA">United States</option>
                <option value="Canada">Canada</option>
                <option value="Other">Other (we'll contact you)</option>
              </select>
            </div>

            {/* Shirt Size */}
            <div>
              <label className="block text-white font-semibold mb-2">
                T-Shirt Size *
              </label>
              <div className="grid grid-cols-5 gap-3">
                {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => updateField('shirtSize', size)}
                    className={`py-3 rounded-xl font-bold transition-all ${
                      formData.shirtSize === size
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {isSubmitting ? 'Saving...' : 'Submit Shipping Info'}
            </button>
          </div>
        </form>

        {/* Footer Note */}
        <div className="mt-8 text-center text-white/60 text-sm">
          <p>🚚 Your gift box will ship within 2-4 weeks</p>
          <p className="mt-2">📧 You'll receive tracking info at your email</p>
        </div>
      </div>
    </div>
  )
}
