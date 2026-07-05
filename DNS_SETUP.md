# OrbitPay DNS & SSL Setup Guide

## Current Status
Your domains are configured in Vercel but DNS is not pointing to Vercel yet. This is why you see "Not Secure" in the browser.

## DNS Configuration Required

You need to add DNS records at your domain registrar (where you purchased orbitpaybank.online).

### Step 1: Log into your Domain Registrar

Common registrars:
- GoDaddy
- Namecheap
- Google Domains
- Cloudflare
- Hover
- Network Solutions

### Step 2: Add DNS Records

Add these records in your DNS settings:

#### For orbitpaybank.online (Main Domain)
| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 76.76.21.21 | 300 |

#### For admin.orbitpaybank.online (Admin Subdomain)
| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | admin | cname.vercel-dns.com | 300 |

#### For www (Optional)
| Type | Name | Value | TTL |
|------|------|-------|-----|
| CNAME | www | cname.vercel-dns.com | 300 |

### Step 3: Verify DNS Propagation

After adding the DNS records, verify with:
```bash
# Check if DNS is pointing to Vercel
nslookup orbitpaybank.online
# Should show: 76.76.21.21

nslookup admin.orbitpaybank.online
# Should show: cname.vercel-dns.com
```

### Step 4: SSL Certificate (Automatic)

Once DNS propagates, Vercel will automatically issue SSL certificates. This usually takes:
- 5-30 minutes for initial propagation
- Up to 24-48 hours for complete global propagation

## Alternative: Using Cloudflare (Recommended)

For better performance and security, consider using Cloudflare:

1. Go to https://dash.cloudflare.com
2. Add your domain orbitpaybank.online
3. Update nameservers at your registrar to Cloudflare's nameservers
4. Add these DNS records in Cloudflare:

```
Type    Name    Content              Proxy
A       @       76.76.21.21         DNS only
CNAME   admin   cname.vercel-dns.com DNS only
CNAME   www     cname.vercel-dns.com DNS only
```

## Security Features Enabled

Once DNS propagates, your sites will have:
- ✅ Free SSL certificate (Let's Encrypt)
- ✅ HTTP/2 support
- ✅ Modern TLS 1.3
- ✅ HSTS headers
- ✅ Security headers (X-Frame-Options, X-Content-Type-Options, etc.)

## Temporary URLs (Working Now)

While waiting for DNS, use these URLs:
- Member Portal: https://user-portal-mauve.vercel.app
- Admin Portal: https://admin-portal-sandy-gamma.vercel.app

## Need Help?

If you're unsure how to add DNS records, contact your domain registrar's support. They can guide you through the process.

---

Generated for OrbitPay Credit Union Platform
Date: 2024
