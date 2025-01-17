# H4BB0 DR34M W0RLD

A retro-style virtual world with 8-bit graphics, created by F3V3R DR34M team.

## Features

- 8-bit pixel art avatars
- Real-time customization
- Multiplayer rooms
- Chat system
- User authentication
- Data persistence using GitHub Gists

## Setup

1. Fork this repository
2. Enable GitHub Pages in your repository settings:
   - Go to Settings > Pages
   - Source: Deploy from a branch
   - Branch: main / (root)
   - Click Save

3. Create a GitHub OAuth App:
   - Go to GitHub Settings > Developer settings > OAuth Apps > New OAuth App
   - Set Homepage URL to: `https://[your-username].github.io/[repo-name]`
   - Set Authorization callback URL to: `https://[your-username].github.io/[repo-name]/callback.html`
   - Copy the Client ID and Client Secret

4. Update `config.js` with your GitHub OAuth credentials

## Development

```bash
# Clone the repository
git clone https://github.com/[your-username]/[repo-name].git

# Navigate to the project directory
cd [repo-name]

# Start a local server (using Python for example)
python -m http.server 8000
```

## Credits

Created by F3V3R DR34M Team
CR4CK3D BY: Z4R1G4T4
