# Twilio SIP Trunk Setup for LiveKit Cloud

This guide walks you through configuring a Twilio SIP trunk for outbound calls with LiveKit Cloud.

## Prerequisites

- Twilio account with at least one voice-capable phone number
- LiveKit Cloud account
- Twilio CLI installed (optional, can use console UI)

## Step 1: Get Your LiveKit SIP URI

1. Sign in to [LiveKit Cloud](https://cloud.livekit.io/)
2. Go to **Project Settings**
3. Copy your **SIP URI** (format: `sip:xxxxx.sip.livekit.cloud`)
4. Note the **SIP Endpoint** (same as above without `sip:` prefix): `xxxxx.sip.livekit.cloud`

## Step 2: Create Twilio SIP Trunk

### Using Twilio Console (Recommended)

1. Sign in to [Twilio Console](https://console.twilio.com/)
2. Navigate to **Elastic SIP Trunking** → **Manage** → **Trunks**
3. Click **Create new SIP Trunk**
4. Enter a friendly name (e.g., "LiveKit Outbound")
5. Click **Create**

### Using Twilio CLI

```bash
twilio api trunking v1 trunks create \
  --friendly-name "LiveKit Outbound" \
  --domain-name "your-trunk-name.pstn.twilio.com"
```

Save the **Trunk SID** from the output (format: `TKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`).

## Step 3: Configure Termination (for Outbound Calls)

### 3a. Get the Termination SIP URI

1. In your trunk settings, go to **Termination**
2. Copy the **Termination SIP URI** (format: `your-trunk-name.pstn.twilio.com`)

### 3b. Create Credential List

1. Navigate to **Voice** → **Manage** → **Credential lists**
2. Click **Create new credential list**
3. Enter:
   - **Friendly Name**: "LiveKit Credentials"
   - **Username**: Choose a username (e.g., `livekit-user`)
   - **Password**: Choose a strong password
4. Click **Create**
5. **Save these credentials** - you'll need them for LiveKit configuration

### 3c. Associate Credentials with Trunk

1. Go back to **Elastic SIP Trunking** → **Manage** → **Trunks**
2. Select your trunk
3. Go to **Termination** → **Authentication**
4. Under **Credential Lists**, click **Add**
5. Select the credential list you created
6. Click **Save**

## Step 4: Associate Phone Number with Trunk

1. In your trunk settings, go to **Phone Numbers**
2. Click **Add a phone number**
3. Select your voice-capable phone number
4. Click **Add Selected**

Alternatively via CLI:
```bash
# List your phone numbers
twilio phone-numbers list

# List your trunks
twilio api trunking v1 trunks list

# Associate phone number with trunk
twilio api trunking v1 trunks phone-numbers create \
  --trunk-sid TKxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx \
  --phone-number-sid PNxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Step 5: Create Outbound Trunk in LiveKit Cloud

1. Sign in to [LiveKit Cloud](https://cloud.livekit.io/)
2. Navigate to **Telephony** → **Configuration**
3. Click **Create new** → **Trunk**
4. Select **JSON editor** tab
5. Select **Outbound** for **Trunk direction**
6. Paste the following JSON (replace with your values):

```json
{
  "name": "Twilio Outbound",
  "address": "your-trunk-name.pstn.twilio.com",
  "numbers": ["+1XXXXXXXXXX"],
  "authUsername": "livekit-user",
  "authPassword": "your-password"
}
```

Replace:
- `your-trunk-name.pstn.twilio.com` - Your Twilio Termination SIP URI
- `+1XXXXXXXXXX` - Your Twilio phone number (E.164 format)
- `livekit-user` - Username from credential list
- `your-password` - Password from credential list

7. Click **Create**

## Step 6: Get the SIP Trunk ID

After creating the trunk in LiveKit:

1. Go to **Telephony** → **Configuration**
2. Find your trunk in the **Outbound** section
3. Click on it to view details
4. Copy the **SIP Trunk ID** (format: `ST_xxxxxxxxxxxxxxxxxxxxxxx`)

This is your `SIP_TRUNK_ID` for the `.env` file.

## Verification

Test your setup using the LiveKit CLI:

```bash
# Install LiveKit CLI if needed
# macOS: brew install livekit-cli
# Others: see https://docs.livekit.io/home/cli/cli-setup/

# Set environment variables
export LIVEKIT_URL=wss://your-project.livekit.cloud
export LIVEKIT_API_KEY=APIxxxxxxxxxxxxxxx
export LIVEKIT_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# List outbound trunks to verify
lk sip outbound list
```

## Test Outbound Call

Create a test file `test-call.json`:

```json
{
  "sip_trunk_id": "ST_xxxxxxxxxxxxxxxxxxxxxxx",
  "sip_call_to": "+1XXXXXXXXXX",
  "room_name": "test-room",
  "participant_identity": "test-caller",
  "participant_name": "Test Call"
}
```

Initiate test call:
```bash
lk sip participant create test-call.json
```

## Troubleshooting

### Call fails immediately
- Verify credentials are correct in LiveKit trunk configuration
- Check Twilio trunk has the phone number associated
- Ensure phone number has voice capability

### No audio
- Verify Twilio trunk Termination is properly configured
- Check LiveKit agent is running and connected to the room

### Authentication errors
- Double-check username/password match between Twilio credential list and LiveKit trunk
- Ensure credential list is associated with the trunk's Termination settings

## Environment Variables Summary

After completing this setup, you'll have these values for your `.env`:

```bash
# From Twilio Console
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_SMS_PHONE_NUMBER=+1XXXXXXXXXX
TWILIO_VOICE_PHONE_NUMBER=+1XXXXXXXXXX

# From LiveKit Cloud Dashboard
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=APIxxxxxxxxxxxxxxx
LIVEKIT_API_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SIP_TRUNK_ID=ST_xxxxxxxxxxxxxxxxxxxxxxx
```

## References

- [LiveKit SIP Trunk Setup](https://docs.livekit.io/sip/quickstarts/configuring-sip-trunk/)
- [LiveKit + Twilio Configuration](https://docs.livekit.io/sip/quickstarts/configuring-twilio-trunk/)
- [LiveKit Outbound Trunk API](https://docs.livekit.io/sip/trunk-outbound/)
- [Twilio Elastic SIP Trunking](https://www.twilio.com/docs/sip-trunking)
