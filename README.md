# sharkbot (v1.1)
"look at this dumb thing I made" - @rafasaur, June 2020

This bot is very dumb and there are definitely bots that do things better, but he is my son and I love him very much.

## Implemented features
Currently, Sharkbot can:
- [x] affirm your friends!
  - [x] a variety of affirmations (please submit more!)
- [x] alarm clock
 - [x] a variety of sayings for default reminders
- [x] create/assign/remove pronoun roles!
- [x] polls
- [x] react to messages, sometimes!
- [x] smooth members
  - [x] a smoother smoothing experience
- [x] welcome new members with a DM filled to the brim with instructions!
- [x] a help function!

### In progress/to be implemented
- [ ] the ability to add alarms...
- [ ] add time limit to polls?
- [ ] choose your own emoji for polls?
- [ ] twitch alerts
- [ ] music streaming
- [ ] move welcome message to a display/edit-friendly `.txt` file
- [ ] a more robust help function?

## Feature documentation

### affirm
`!affirm` will send the author a random affirmation from `affirmations.txt`. Adding mentions (`@user`) after the command will send an affirmation to every member mentioned.

### alarms
Currently, all alarms must be hardcoded in `alarms.txt`. In our discord, we have a channel where most alarms/reminders go (for basic life reminders, like eating and taking meds), so that is the default if no location is specified (but should be updated in `config.json`). As with affirmations, there are a number of sayings sharkbot can choose from for each of these reminders, stored in the `reminders` folder (note the alarm name and text file should be the same).

### help
Self-explanatory...? For each command there is (or will be) a `help` function, which `!help command` will call. Can also `!info` for general bot information.

### groups
Add and join a group role! `!group add groupname` will add a role that members can then join with `!join groupname`, to facilitate @-ing a certain subset of the server.

### polls
Create a poll with `!poll {description} [option 1] [option 2] [option 3] [etc]`. Omitting the options will creating a simple yes/no/maybe poll. Sharkbot reacts automatically with any emoji necessary, so members need not go searching for them. Must be monitored manually.

### pronouns
A few functions here (**note:** all pronouns are expected to be of the form `xie/xer`):
- `!pronoun add pro/noun`, when used by a mod, will create a `pro/noun` role and logs it in `pronouns.txt`.
- `!pro/noun` (or more verbosely, `!pronoun assign pro/noun`) will assign the pronoun role to the author, if the role exists (and is in `pronouns.txt`).
- `!pronoun remove pro/noun` removes the requested pronoun role from the user, provided they have it and it is in `pronouns.txt`.

### reacts
Delve into `react.js` to see what's up. I think it's funny to have sharkbot react to specific messages (e.g., anytime he's mentioned he reacts with a sharktank emoji), but this should obviously be customized on a server-by-server basis.

### smooth
I shouldn't be as proud of this as I am. `!smooth` sends the user an invite back to the server before kicking them. To improve (or, "smooth") the experience, when they rejoin, their nickname and roles are reset for them.

### welcome
Sends a welcome message detailing some of sharkbot's usage, in particular how to assign pronouns. Embedded in here is also a pestering function, to pester a member each time they post if they haven't assigned themselves a pronoun. It's not intentionally every message to be annoying, just that it's *so* much easier to code.

One thing I've encountered is people not reading the welcome message and replying directly to sharkbot (which doesn't work). I'm looking into ways of making this work, but I don't think I can make it work globally (i.e., for more than one server).

### miscellany
#### `config.json`
Individual details relevant to each feature/command are described above, so I'll discuss general/global values here.

- `enabled`/`restricted`/`secret`: these options, respectively, decide whether the feature in question is loaded, can be used only by mods (or other roles in `importantRoles`), and whether they show up in the `!help` command listing.

### Further documentation to come!
I've tried to keep my code readable and well-commented, for my own sanity. To those of you not-mes reading this (or future-mes, hi!), hopefully this makes up for my lack of detailed documentation here. I love you!


## Resources and references
I consider sharkbot my own, but it would not have been possible without drawing on numerous examples and documentation from other discord bots. The bones come from the [Discord.JS guide](discordjs.guide), with an uncountable number of times reading and re-reading the documentation on [discord.js.org](discord.js.org). Alarms are taken more or less straight from the examples from the [node-schedule](https://github.com/node-schedule/node-schedule) readme. Twitch code is currently straight from [Lunar bot](https://github.com/maikdevries/Lunar), but will be updated once I get around to actually implementing it. I have countlessly searched for examples and solutions, often finding help on stack exchange and similar websites, so sharkbot truly is a child of many.

And of course the **biggest** thank you to everyone who's helped raise/test my son (Thad in particular) and answered my questions on the Discord.js discord (I'll understand async functions someday...).
