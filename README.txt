NIKHIL SHARMA — UPDATED PORTFOLIO

PROJECT FILES
- App.jsx
- App.css
- public/Nikhil-Sharma-Resume.pdf

PROJECTS INCLUDED
1. Telecom App Monitoring on Linux
2. SoleHub — E-Commerce Web Application
   Live: https://solehub-phi.vercel.app
3. Gas Network GIS Project
4. Personal Portfolio Website
   Live: https://nikhil07.vercel.app

EMAILJS
The contact form reuses the credentials from the previous portfolio:
- Service ID: service_nwt81jo
- Template ID: template_lu7o40l
- Public Key: C2C44A1wdsf8zeg0y

Install the dependency:
  npm install @emailjs/browser

IMPORTANT: In your EmailJS dashboard, open template_lu7o40l and make sure
the template uses these form variable names:
- {{from_name}}
- {{from_email}}
- {{message}}
- {{reply_to}} (optional; useful as the Reply-To address)

Make sure the template's "To Email" is the inbox where you want to receive
messages, and that service_nwt81jo is connected to the correct email provider.

EMAIL ERROR TROUBLESHOOTING
- "The service ID not found": check the Service ID in EmailJS.
- "The template ID not found": check the Template ID.
- "The public key is invalid": check the Public Key in EmailJS account settings.
- "The recipient address is not found": set the template's To Email field.
- "The user is not found" / authorization errors: verify the EmailJS service connection.
- If the form says sent but no email arrives, check Spam/Junk and the EmailJS
  dashboard's Email History.

The form now captures the form element before awaiting the EmailJS request.
This avoids a common React issue where event.currentTarget is unavailable
after an await. It also displays the actual EmailJS error response on screen
and logs the response in the browser console.

SETUP
1. Create a React + Vite project.
2. Put App.jsx and App.css in src/.
3. Put the public folder at the project root.
4. Install EmailJS: npm install @emailjs/browser
5. Start the app: npm run dev

BEFORE PUBLISHING
- Verify all project descriptions and technologies are accurate.
- Add repository links if you want to display public GitHub source code.
- Submit a test message and verify it appears in EmailJS Email History and your inbox.
