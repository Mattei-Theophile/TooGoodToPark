class CookieService {
    constructor() {
        this.consentKey = 'cookie-consent'
        this.consentDateKey = 'cookie-consent-date'
        this.consentExpiryDays = 365 // Consent expires after 1 year
    }

    // Check if consent is needed
    isConsentNeeded() {
        const consent = this.getConsent()
        if (!consent) return true

        // Check if consent has expired
        const consentDate = localStorage.getItem(this.consentDateKey)
        if (consentDate) {
            const expiryDate = new Date(consentDate)
            expiryDate.setDate(expiryDate.getDate() + this.consentExpiryDays)

            if (new Date() > expiryDate) {
                this.clearConsent()
                return true
            }
        }

        return false
    }

    // Get current consent
    getConsent() {
        try {
            const consent = localStorage.getItem(this.consentKey)
            return consent ? JSON.parse(consent) : null
        } catch (error) {
            console.error('Error parsing cookie consent:', error)
            return null
        }
    }

    // Set consent
    setConsent(consent) {
        localStorage.setItem(this.consentKey, JSON.stringify(consent))
        localStorage.setItem(this.consentDateKey, new Date().toISOString())
    }

    // Clear consent
    clearConsent() {
        localStorage.removeItem(this.consentKey)
        localStorage.removeItem(this.consentDateKey)
    }

    // Check if specific cookie type is allowed
    isAllowed(cookieType) {
        const consent = this.getConsent()
        return consent ? consent[cookieType] === true : false
    }

    // Helper methods for common cookie types
    canUseAnalytics() {
        return this.isAllowed('analytics')
    }

    canUseMarketing() {
        return this.isAllowed('marketing')
    }

    canUseFunctional() {
        return this.isAllowed('functional')
    }

    // Set a cookie only if consent is given for that type
    setCookie(name, value, options = {}, cookieType = 'functional') {
        if (!this.isAllowed(cookieType)) {
            console.warn(`Cookie "${name}" not set: ${cookieType} cookies not allowed`)
            return false
        }

        // Set cookie logic here
        const expires = options.expires || 365
        const date = new Date()
        date.setTime(date.getTime() + (expires * 24 * 60 * 60 * 1000))

        document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=${options.path || '/'}`
        return true
    }

    // Get cookie
    getCookie(name) {
        const nameEQ = name + '='
        const ca = document.cookie.split(';')

        for (let i = 0; i < ca.length; i++) {
            let c = ca[i]
            while (c.charAt(0) === ' ') c = c.substring(1, c.length)
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
        }
        return null
    }
}

export default new CookieService()