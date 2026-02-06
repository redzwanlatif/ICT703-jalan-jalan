# Jalan-Jalan User Journey Test Guide

Welcome! This guide helps you test the Melaka travel planning experience.

---

## Before You Start

1. Open the app at `http://localhost:3000`
2. Go to `/user-flow` to see all journeys
3. Follow each journey below step by step

---

## Journey 1: First-Time User

*"I'm new here and want to explore the app"*

### Steps:

**Step 1 → Chat with AI**
- Go to `/chat`
- Type `hello` and press Enter
- Try typing `food` to get Melaka food recommendations
- Try typing `1` to check crowd levels

**Step 2 → Plan your first trip**
- Go to `/predictions`
- Select **Melaka** as destination
- Pick your travel dates
- Add number of travelers
- Click **Continue to Preferences**

**Step 3 → Explore the dashboard**
- After planning, you'll land on `/dashboard`
- Look at the Group Summary card
- Check the Proposed Destinations (Melaka spots!)

**Step 4 → Join community**
- Go to `/community`
- Browse travel stories
- Check upcoming events

---

## Journey 2: Planning a Trip

*"I want to plan a trip to Melaka"*

### Steps:

**Step 1 → Enter trip details**
- Go to `/predictions`
- Select **Melaka**
- Choose your dates
- Set **4 travelers**
- Click **Continue to Preferences**

**Step 2 → Set your preferences**
- Choose travel style (Budget / Balanced / Comfortable)
- Set crowd preference
- Enter budget range (try RM 800 - RM 1500)
- Toggle safety options
- Click **Generate Travel Plan**

**Step 3 → Review your AI plan**
- Wait for the plan to generate
- You'll see 3 plan options:
  - Low Crowd Plan
  - Balanced Plan ⭐ Recommended
  - Budget Saver Plan
- Click each to compare
- Check the alerts (Jonker Street crowds, weather, etc.)
- Click **Confirm & Save Plan**

**Step 4 → Check live data**
- You're now on `/dashboard`
- See your group summary
- Check budget compatibility
- View proposed Melaka destinations
- Click **View Full Itinerary**

**Step 5 → Set your budget**
- Go to `/informatics/planner`
- Create or view your trip budget

---

## Journey 3: During Travel

*"I'm currently in Melaka and need help"*

### Steps:

**Step 1 → Check weather**
- Go to `/chat`
- Type `weather`
- See today's forecast for Melaka

**Step 2 → View your schedule**
- Go to `/dashboard/itenary`
- Check Day 1 activities:
  - Morning: Arrive & check-in
  - Afternoon: A Famosa & St. Paul's Hill
  - Evening: Jonker Street Night Market

**Step 3 → Ask AI for tips**
- Go to `/chat`
- Try these questions:
  - `What should I eat?`
  - `Is Jonker Street crowded now?`
  - `How do I get around?`

**Step 4 → Log your expenses**
- Go to `/informatics/planner`
- Add today's spending

---

## Journey 4: Post-Trip

*"I'm back from Melaka and want to reflect"*

### Steps:

**Step 1 → Review spending**
- Go to `/informatics/insights`
- Check how much you spent
- See spending breakdown

**Step 2 → Add reflection**
- Go to `/informatics/reflection`
- Write about your Melaka experience

**Step 3 → Share your story**
- Go to `/community/stories/create`
- Share your Melaka adventure with others

**Step 4 → Update your goals**
- Go to `/informatics/dashboard`
- Set goals for your next trip

---

## Quick Chat Commands

While in `/chat`, try these:

| Type | What you'll get |
|------|-----------------|
| `hello` | Welcome message |
| `1` | Crowd levels |
| `2` | Trip itinerary |
| `3` | Weather info |
| `4` | Budget tips |
| `5` | Food recommendations |
| `6` | Safety info |
| `jonker` | Jonker Street details |
| `food` | Best Melaka food |

---

## What to Look For

As you test, notice:

✅ Buttons take you to the right pages
✅ Melaka data appears everywhere (not other cities)
✅ Chat responds with helpful Melaka info
✅ The flow feels natural and easy
✅ All 4 group members appear in dashboard

---

## Need Help?

- **Lost?** Go to `/user-flow` to see the map
- **Chat not working?** Refresh the page
- **Button not responding?** Try clicking again

---

Enjoy exploring Melaka! 🇲🇾
