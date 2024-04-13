## BASE

- default chain for this example is Base Sepolia
- Account Abstraction with Privy
- Proof of personhood with WorldID
- Stake USDC to create a campaign
  - [Example Smart Contract Deployed on Base Sepolia](https://sepolia.basescan.org/address/0xb0aa221c72ba32de00741640c77a334c8d1f6e80)
  - 
- Create EAS attestation for whoever partecipated in the voting of a campaign
  - SCHEMA ID [Example schema](https://base-sepolia.easscan.org/schema/view/0x4cac6085abd06829b0cd0a642fbdbb189134d801795ba845aa3b692377db1b23)
    - Attestation recipient: the user that has interacted with a campaign
    - takeoffCampaignID: string
    - votesReceived: uint16
    - votesReceivedRecipients: address[]
    - votesGiven: uint16
    - votesGivenRecipients: address[]
  - [Example Attestation](https://base-sepolia.easscan.org/attestation/view/0x3446880816bacdc9ca9c029ca4b77b66a6728958351d15af7e77de21402249e2)
    
- NFT for winner of campaigns
  - [Example NFT](https://sepolia.basescan.org/address/0xda3ef1daca988d892277a6e36faa8204fa45d52b)
  - Improvements:
    - Create Soulbound NFT

- 