# Privacy Policy

**Last Updated: March 19, 2026**

## Introduction

This Privacy Policy explains how the Whoop MCP Server ("we," "our," or "the application") handles your personal and health data when you use this service to connect your Whoop data to AI assistants.

## What This Application Does

The Whoop MCP Server is a Model Context Protocol (MCP) integration that acts as a secure bridge between your Whoop account and AI assistants (such as Claude Desktop, ChatGPT, Cursor, and other MCP-compatible tools). It allows AI assistants to access your Whoop health data to answer questions and provide insights.

## Information We Access

When you authorize this application, we request read-only access to the following data from your Whoop account:

### Personal Information
- User ID
- Email address
- First name and last name
- Height and weight
- Maximum heart rate

### Health and Biometric Data

**Recovery Metrics:**
- Recovery scores
- Heart rate variability (HRV RMSSD)
- Resting heart rate (RHR)
- Blood oxygen saturation (SpO2)
- Skin temperature

**Sleep Data:**
- Sleep stages (light sleep, REM sleep, slow-wave sleep)
- Total time in bed and awake time
- Sleep disturbances
- Sleep efficiency and performance metrics
- Respiratory rate
- Sleep debt calculations

**Workout and Strain Data:**
- Strain scores
- Average and maximum heart rate during activities
- Energy expenditure (kilojoules)
- Sport type and activity details
- Distance and altitude metrics
- Heart rate zone distribution
- Workout duration and intensity

**Physiological Cycles:**
- 24-hour cycle strain data
- Daily energy metrics
- Heart rate patterns
- Timezone information

## How We Use Your Information

The application uses your Whoop data exclusively to:

1. **Respond to AI Assistant Requests**: When you ask your AI assistant questions about your health data, the application retrieves the relevant information from Whoop's API
2. **Enable Data Analysis**: Allow AI tools to analyze patterns, trends, and insights from your health metrics
3. **Maintain Authentication**: Store OAuth tokens to maintain your authorized connection to Whoop

**Important**: This application is **read-only**. We cannot modify, delete, or write any data to your Whoop account.

## How We Store Your Information

### Local Token Storage
- OAuth access tokens and refresh tokens are stored locally on your device at `~/.config/whoop-mcp/tokens.json`
- Token files are protected with restricted file permissions (0o600 - readable and writable only by you)
- Tokens are automatically refreshed 5 minutes before expiration
- **No tokens are transmitted to third parties** except Whoop's official API servers for authentication

### Health Data Storage
- **We do not persistently store your health data**
- Health metrics are retrieved from Whoop's API in real-time when requested by your AI assistant
- Data flows directly from Whoop to your AI assistant through this application
- No databases or permanent storage of health metrics

## Third-Party Data Sharing

### Whoop API
- We connect to Whoop's official API (api.prod.whoop.com) to retrieve your data
- All communication with Whoop uses secure HTTPS connections
- Authentication uses industry-standard OAuth 2.0 protocol

### AI Assistant Integration
When you use this application, your Whoop data is shared with the AI assistant you're using (e.g., Claude, ChatGPT, Cursor). **Important considerations**:

- Data shared with AI assistants is subject to their respective privacy policies
- We recommend reviewing the privacy policy of your AI assistant provider
- Conversations with AI assistants may be retained according to their data retention policies
- You control what data is accessed by choosing which questions to ask your AI assistant

### No Other Third Parties
- We do not sell, rent, or share your data with advertisers or data brokers
- We do not use your data for marketing purposes
- We do not share your data with any parties other than Whoop (for authentication) and your chosen AI assistant

## Data Security

We implement the following security measures:

1. **OAuth 2.0 Authentication**: Industry-standard authorization protocol requiring your explicit consent
2. **Restricted File Permissions**: Token storage with owner-only access rights
3. **Automatic Token Rotation**: Tokens are automatically refreshed to maintain security
4. **HTTPS Encryption**: All API communications use encrypted connections
5. **No Network Storage**: No cloud storage or remote databases
6. **Developer Credentials Required**: OAuth client credentials required for operation, limiting unauthorized access

## Your Rights and Choices

You have the following rights regarding your data:

### Access and Control
- You can view all data accessed by reviewing the available tools in the application
- You can control which data types are accessed by choosing which AI assistant queries to make

### Revocation
You can revoke this application's access to your Whoop data at any time by:
1. Visiting your Whoop account settings
2. Navigating to connected applications or authorized apps
3. Removing authorization for this MCP Server
4. Alternatively, delete the token file at `~/.config/whoop-mcp/tokens.json`

### Data Deletion
- To delete locally stored tokens: Remove `~/.config/whoop-mcp/tokens.json`
- To delete data held by Whoop: Contact Whoop directly through their privacy controls
- To delete data shared with AI assistants: Follow the data deletion procedures of your AI assistant provider

## Limitations of This Application

Please note:

- This is a **developer tool** requiring OAuth client credentials from Whoop
- It is designed for personal use and integration with AI assistants
- We are not affiliated with Whoop, Inc. - this is an independent integration
- We cannot control how AI assistant providers handle data you share with them

## Children's Privacy

This application is not intended for use by individuals under the age of 18. We do not knowingly collect data from children.

## Changes to This Privacy Policy

We may update this Privacy Policy from time to time. Changes will be reflected in the "Last Updated" date at the top of this document. Continued use of the application after changes constitutes acceptance of the updated policy.

## Data Retention

- **Tokens**: Stored indefinitely until you revoke access or delete the token file
- **Health Data**: Not retained - retrieved in real-time as needed
- **Logs**: Application does not maintain user activity logs

## International Users

This application runs locally on your device. Your data is transmitted directly between:
- Your device and Whoop's servers (location depends on Whoop's infrastructure)
- Your device and your AI assistant's servers (location depends on your AI provider)

Please review Whoop's and your AI provider's privacy policies for information about international data transfers.

## Technical Details

### OAuth Scopes Requested
```
read:recovery
read:cycles
read:workout
read:sleep
read:profile
read:body_measurement
offline
```

### API Access Pattern
- All data requests use Whoop's official Developer API v2
- Pagination supported (default 25 records, max 25 per request)
- ISO 8601 date formatting for time-based queries

## Contact Information

For questions about this Privacy Policy or how your data is handled:

- Review the application source code (open source)
- Submit issues or questions through the project repository
- Contact your Whoop account representative for questions about Whoop's data practices
- Contact your AI assistant provider for questions about their data practices

## Compliance

This application:
- Operates in accordance with Whoop's Developer Terms of Service
- Follows OAuth 2.0 security best practices
- Implements data minimization principles (only accesses data necessary for functionality)
- Provides transparency about data flows and usage

## Your Consent

By using this application and authorizing it to access your Whoop data, you consent to:
- The data access patterns described in this policy
- The storage of authentication tokens on your local device
- The sharing of your Whoop data with your chosen AI assistant when you make requests

You can withdraw this consent at any time by revoking authorization as described in the "Your Rights and Choices" section.

---

**This privacy policy is provided for transparency and user awareness. For the most up-to-date information about how Whoop handles your underlying health data, please refer to Whoop's Privacy Policy at https://www.whoop.com/privacy-policy**
