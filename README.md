# Gemini Vercel Backend

A serverless backend deployed on **Vercel** that uses the **Google Gemini API** to answer questions. Designed to be called from Java code via a simple HTTP GET request.

## How It Works

Your Java code sends a GET request like:

```
https://your-app.vercel.app/xxx/get?q=write+a+hello+world+in+python&t=code
```

The backend receives the question (`q`) and type (`t`), sends it to Google Gemini, and returns the answer as plain text.

### Supported Types (`t` parameter)

| Type      | Behavior                                      |
|-----------|-----------------------------------------------|
| `code`    | Returns only clean code, no explanations       |
| `mcq`     | Returns the correct MCQ option (e.g., `B) ...`) |
| *(empty)* | Returns a general helpful answer               |

---

## 🚀 Deploy to Vercel (Step-by-Step)

### Step 1: Get a Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click **"Create API Key"**
3. Copy the key — you'll need it in Step 4

### Step 2: Push Code to GitHub

```bash
cd d:\CLI
git init
git add .
git commit -m "Initial commit"
```

Then create a new repository on [github.com](https://github.com/new) and push:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### Step 3: Import Project on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New" → "Project"**
3. Select your GitHub repository
4. Framework preset: **Other** (leave as-is)
5. Click **Deploy**

### Step 4: Add Your Gemini API Key

1. In Vercel, go to your project → **Settings** → **Environment Variables**
2. Add:
   - **Key**: `GEMINI_API_KEY`
   - **Value**: *(paste your Gemini API key)*
3. Click **Save**
4. Go to **Deployments** → click the 3 dots on latest → **Redeploy**

### Step 5: Update Your Java Code

Replace the URL in your Java code with your Vercel URL:

```java
try {
    System.out.println(
        new java.util.Scanner(
            new java.net.URL("https://YOUR-APP.vercel.app/xxx/get?q=enter-your-question&t=code").openStream()
        ).useDelimiter("\\A").next()
    );
} catch (Exception e) {
    e.printStackTrace();
}
```

Replace `YOUR-APP` with your actual Vercel subdomain.

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and add your key
copy .env.example .env
# Edit .env and paste your GEMINI_API_KEY

# 3. Install Vercel CLI and run locally
npx vercel dev
```

Then test: `http://localhost:3000/xxx/get?q=hello+world+in+python&t=code`

---

## Project Structure

```
├── api/
│   └── get.js          # Serverless function (Gemini integration)
├── .env.example        # Environment variable template
├── .gitignore
├── package.json
├── vercel.json         # Routing configuration
└── README.md
```
