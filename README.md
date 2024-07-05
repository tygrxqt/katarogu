![banner](/public/banner.png)

# What is Katarogu?

Katarogu is a free, open-source and community driven manga and anime tracking service built as an open and modern alternative to existing services like [MAL](https://myanimelist.net/about.php) and [MyAniList](https://anilist.co/).

> [!WARNING]  
> Katarogu is currently in alpha stages of development, breaking changes, bugs and missing features are to be expected.

# Tech stack

- Framework: [NextJS](https://nextjs.org/)
- Deployment: [Vercel](https://vercel.com/home) / [Hetzner](https://www.hetzner.com/cloud/)
- UI: [shadcn/ui](https://ui.shadcn.com/)
- Styling: [TailwindCSS](https://tailwindcss.com/)
- Database: [PocketBase](https://pocketbase.io/)

# Running locally

### App Setup

Run the following commands to clone the repository, download the app's packages, and start the server.

```bash
git clone https://github.com/tygerxqt/katarogu -b canary
cd katarogu
pnpm install # you can also use yarn install or npm install

# Start a development server
pnpm dev

# Build and start the app.
pnpm build ; pnpm start
```

# Contact

If you need to contact me, please send inquires via email: [hi@tygr.dev](mailto:hi@tygr.dev).
