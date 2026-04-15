# TFT Set 17: Space Gods — Reference Data

Use this data to create the set-17 asset files, matching the exact format of the existing set-16 data.

## Existing Set Format Reference

### units.json format:
```json
{
  "units": [
    {
      "name": "Champion Name",
      "type": "Magic Fighter",
      "traits": ["Origin1", "Class1"],
      "cost": 1,
      "ability": {
        "name": "Ability Name",
        "mana_start": 0,
        "mana_max": 60,
        "description": "Ability description."
      }
    }
  ]
}
```

### synergy_grid.json format:
```json
{
  "classes": [
    {
      "name": "ClassName",
      "description": "Short description.",
      "champions": ["Champ1", "Champ2"],
      "bonuses": {
        "2": "Bonus at 2",
        "4": "Bonus at 4"
      }
    }
  ],
  "origins": [
    {
      "name": "OriginName",
      "description": "Short description.",
      "champions": ["Champ1", "Champ2"],
      "bonuses": {
        "2": "Bonus at 2",
        "4": "Bonus at 4"
      }
    }
  ]
}
```

### emblems.json format:
Array of class names that can have emblems (non-unique classes).

### compositions.json format:
```json
{
  "compositions": [
    {
      "name": "Comp Name",
      "units": ["Champ1", "Champ2", "Champ3"],
      "tier": "S",
      "strategy": "Standard"
    }
  ]
}
```

---

## Set 17 Champions Data

| Champion | Cost | Origin(s) | Class(es) | Type | Ability Name | Ability Description |
|----------|------|-----------|-----------|------|-------------|-------------------|
| Aatrox | 1 | N.O.V.A. | Bastion | Melee Tank | Stellar Slash | Slash in a wide arc dealing physical damage to nearby enemies. Heal for a portion of damage dealt. |
| Briar | 1 | Anima, Primordian | Rogue | Melee Assassin | Fish Frenzy | Passive: For every % missing Health, gain Attack Speed. Active: Deal physical damage to the target. |
| Caitlyn | 1 | N.O.V.A. | Fateweaver | Ranged Caster | Aim For The Head | Fire a headshot at the farthest enemy dealing physical damage. If it kills, refund mana. |
| Cho'Gath | 1 | Dark Star | Brawler | Melee Tank | Devour | Deal magic damage to the lowest Health enemy in range and permanently gain max Health. If this kills them, gain even more max Health. |
| Ezreal | 1 | Timebreaker | Sniper | Ranged AD Caster | Temporal Shot | Fire a blast at the current target dealing physical damage. Every X takedowns, gain a drone that deals physical damage on cast. |
| Leona | 1 | Arbiter | Vanguard | Melee Tank | Shield of Daybreak | Gain Shield for 4 seconds. Bash the current target, dealing magic damage and stunning them. |
| Lissandra | 1 | Dark Star | Shepherd, Replicator | Ranged Caster | Dark Matter | Hurl a dagger towards the target dealing magic damage. The dagger explodes dealing AoE magic damage. |
| Nasus | 1 | Space Groove | Vanguard | Melee Tank | Groovin' Susan | Transform temporarily, gaining max Health and dealing magic damage to adjacent enemies each second. |
| Poppy | 1 | Meeple | Bastion | Melee Tank | Huddle Up! | Throw her buckler at the farthest enemy dealing magic damage. The buckler then bounces to nearby allies, granting them a Shield. |
| Rek'Sai | 1 | Primordian | Brawler | Melee Tank | Upheaval | Heal, then briefly knock up adjacent enemies and deal magic damage. |
| Talon | 1 | Stargazer | Rogue | Melee Assassin | Diviner's Judgment | Stab the target causing bleed for physical damage. After the attack, leap to the highest HP enemy nearby. |
| Teemo | 1 | Space Groove | Shepherd | Ranged Caster | Double Time | Passive: Attacks deal bonus magic damage with stacking DoT. Active: Gain Attack Speed for X attacks. |
| Twisted Fate | 1 | Stargazer | Fateweaver | Ranged Caster | Fate's Gambit | Draw a card (1-9), throw it at target dealing variable magic damage. Overkill damage bounces to nearest enemy. |
| Veigar | 1 | Meeple | Replicator | Ranged Caster | Meepteor Shower | Call down a Meepteor dealing magic damage. Meep Bonus: Additional mini Meepteors on nearby targets. |
| Akali | 2 | N.O.V.A. | Marauder | Melee Assassin | Star Strike | Reposition to strike the most enemies. Throw piercing kunai dealing physical damage. |
| Bel'Veth | 2 | Primordian | Challenger, Marauder | Melee Attack Carry | Tidal Slashes | Unleash a flurry of slashes at the current target, dealing physical damage each. |
| Gnar | 2 | Meeple | Sniper | Ranged AD Carry | Slingshot Maneuver | Every 5th attack, launch a returning boomerang dealing physical damage. Meep Bonus: Meeps attack alongside Gnar. |
| Gragas | 2 | Psionic | Brawler | Melee Tank | Chemical Rage | Heal over time, then deal magic damage to adjacent enemies and Chill them (reduce Attack Speed 30%). |
| Gwen | 2 | Space Groove | Rogue | Melee Assassin | Dance n' Dice | Passive: Attacks deal magic damage. Active: Dash and snip the lowest HP enemy. If kill, dash and snip again. |
| Jax | 2 | Stargazer | Bastion | Melee Tank | — | — |
| Jinx | 2 | Anima | Challenger | Ranged AD Carry | Fishbones! | Fire a barrage of bullets in a cone, each dealing physical damage to the first target hit. |
| Meepsie | 2 | Meeple | Shepherd, Voyager | Support Caster | — | — |
| Milio | 2 | Timebreaker | Fateweaver | Ranged Caster | ULTRA MEGA TIME KICK | Kick a ball at an enemy dealing magic damage. Ball bounces to new targets with halving odds per bounce. |
| Mordekaiser | 2 | Dark Star | Conduit, Vanguard | Melee Tank/Caster | Indestructible | Gain shield. Each second gain more shield and deal magic damage to adjacent enemies. Heal when ability ends. |
| Pantheon | 2 | Timebreaker | Brawler, Replicator | Melee Tank | Advanced Defences | Gain Shield and Durability. Deal physical damage each second to enemies in a cone. |
| Pyke | 2 | Psionic | Voyager | Melee Assassin | Marked for Death | Throw harpoon at furthest enemy, pull them forward. Teleport behind them and cleave for physical damage. |
| Zoe | 2 | Arbiter | Conduit | Ranged Caster | Paddle Star | Fire a paddle star dealing magic damage. It redirects to a distant enemy, repeating damage X times. |
| Aurora | 3 | Anima | Voyager | Ranged Caster | Hopped-Up Hacks | Open a hex rift, Hacking enemies within for X seconds dealing magic damage. |
| Diana | 3 | Arbiter | Challenger | Melee Attack Carry | Pale Cascade | Passive: Attacks deal bonus magic damage. Active: Gain Shield and summon 3 orbiting orbs dealing magic damage. |
| Fizz | 3 | Meeple | Rogue | Melee Assassin | — | — |
| Illaoi | 3 | Anima | Vanguard, Shepherd | Melee Tank | Test of Spirit | Gain Shield. Drain Health from nearest enemies. Then slam down dealing magic damage to enemies within 2 hexes. |
| Kai'Sa | 3 | Dark Star | Rogue | Ranged Assassin | Bullet Cluster | Passive: On takedown, gain mana. Active: Fire missiles around the current target dealing physical damage. |
| Lulu | 3 | Stargazer | Replicator | Ranged Support Caster | It's Raining Stars | Passive: Spell gains a different secondary effect each game. Active: Call down something from the sky dealing magic damage with a special effect. |
| Maokai | 3 | N.O.V.A. | Brawler | Melee Tank | Grasp of Convergence | Passive: Gain more max HP from all sources. Active: Converge vines on target dealing magic damage and stunning. |
| Miss Fortune | 3 | Gun Goddess | — | Ranged AD Carry | Gun Goddess Arsenal | — |
| Ornn | 3 | Space Groove | Bastion | Melee Tank/Crafter | Disco Inferno | Passive: On combat start, forge a temp completed item or make one Radiant. Active: Gain Shield, breathe fire in a cone. |
| Rhaast | 3 | Redeemer | — | Melee Bruiser | Alien Scythe | Gain Durability, healing over duration. Slash forward in a line dealing physical damage and knocking enemies up. |
| Samira | 3 | Space Groove | Sniper | Ranged AD Carry | Jump and Jive | Passive: Shoot knocked-up enemies for physical damage. Active: Volley bullets at target dealing physical damage and knocking up. |
| Urgot | 3 | Mecha | Brawler, Marauder | Ranged Bruiser | Unstoppable Dreadnought | Passive: Proximity Blast fires cone damage when enemies approach. Active: Gain Shield and dash behind current target. |
| Viktor | 3 | Psionic | Conduit | Ranged Caster | Psionic Storm | Channel a psionic storm that follows enemies for X seconds, growing larger and dealing magic damage. |
| Aurelion Sol | 4 | Mecha | Conduit | Ranged Caster | Deathbeam | Channel a deathbeam in a line towards target. Deals magic damage per second, ignores % of enemy Magic Resist. |
| Corki | 4 | Meeple | Fateweaver | Ranged AD Caster | Asteroid Blaster | Strafe to a nearby position, unleashing missiles dealing physical damage. |
| Karma | 4 | Dark Star | Voyager | Ranged Caster | Singularity | Gather black hole force dealing magic damage split between target and closest enemies. |
| Kindred | 4 | N.O.V.A. | Challenger | Ranged Attack Carry | Cosmic Pursuit | Passive: Attacks/Abilities mark targets. At X marks, Wolf consumes them for physical damage. Active: Jump and fire arrows. |
| LeBlanc | 4 | Arbiter | Shepherd | Ranged Caster | Fracture Reality | Passive: Attacks deal magic damage instead. Active: Summon clones that attack alongside LeBlanc, firing bolts of magic damage. |
| Master Yi | 4 | Psionic | Marauder | Melee Attack Carry | Psi Strikes | Passive: Every 3rd attack strikes extra. Active: Enter Psi-State gaining Omnivamp, Attack Speed, and firing psychic projections. |
| Nami | 4 | Space Groove | Replicator | Ranged Support Caster | Bubble Pop | Toss a disco bubble dealing split damage in AoE. Sends globs to nearby enemies. On cast, enter the Groove. |
| Nunu | 4 | Stargazer | Vanguard | Melee Tank | Calamity | Gain Shield. Summon astrolabe crashing on most enemies dealing magic damage. Push astrolabe across board, knocking up enemies. |
| Rammus | 4 | Meeple | Bastion | Melee Tank | — | — |
| Riven | 4 | Timebreaker | Rogue | Melee Assassin | — | — |
| Tahm Kench | 4 | Oracle | Brawler | Melee Tank | — | — |
| The Mighty Mech | 4 | Mecha | Voyager | Melee Tank | Gravity Matrix | Enter defensive stance gaining Durability. Attract nearby projectiles and heal. Release shockwave dealing physical damage. |
| Xayah | 4 | Stargazer | Sniper | Ranged Attack Carry | Stellar Ricochet | Passive: Attacks bounce X times, leaving Feathers. Active: Gain Attack Speed, then recall all Feathers dealing physical damage. |
| Bard | 5 | Meeple | Conduit | Ranged Caster | Ultra Friendly Object | Summon a UFO over target dealing magic damage per second. Extra damage to Tanks. Can abduct dead enemies and create copies. |
| Blitzcrank | 5 | Party Animal, Space Groove | Vanguard | Melee Tank | Party Crasher | Passive: Call bolts on high HP enemies. Active: Summon disco ball, uppercut target into it dealing AoE magic damage. Enter the Groove. |
| Fiora | 5 | Anima | Marauder | Melee Attack Carry | Perfect Bladework | Passive: Every X attacks reveal a Vital. Dash to attack it for true damage and heal. Active: Reveal all Vitals and attack them rapidly. |
| Graves | 5 | Factory New | — | Ranged AD Carry | — | — |
| Jhin | 5 | Dark Star | Sniper | Ranged AD Carry | Space Opera | Passive: Fixed attack speed, converts bonus AS into AD. Active: Summon spectral hands that fire alongside Jhin. |
| Morgana | 5 | Dark Lady | — | Ranged Caster | Dark Form | Transform gaining Shield. Tether nearest enemies dealing magic damage per second and healing. |
| Shen | 5 | Bulwark | Bastion | Melee Tank | Reality Tear | Passive: Attacks gain stacking bonus magic damage. Active: Gain Shield, slice open a rift dealing damage. Slows enemy AS, buffs ally AS. |
| Sona | 5 | Psionic | Shepherd | Ranged Support Caster | Psionic Crush | Hurl magnetic debris at targets dealing magic damage. When debris-carrying enemy dies, it passes on. |
| Vex | 5 | Doomer | — | Ranged Caster | Lend Me a Hand, Shadow! | Passive: Every attack, Shadow strikes a nearby enemy dealing magic damage. Active: Shadow launches empowered strikes. |
| Zed | 5 | Galaxy Hunter | — | Melee Assassin | Quantum Clone | Create a clone behind the target with reduced max Health. Clone inherits items, stats, and current Health, and can cast Quantum Clone. |

## Set 17 Traits Data

### Origins (non-unique)
| Trait | Breakpoints | Effect | Champions |
|-------|------------|--------|-----------|
| Anima | 3 / 5 | Lose streak trait. Gain 15 Tech on losses, plus 5× loss streak length. Gain 2 Tech per Anima takedown. At 100 Tech, prototype Anima Weapons. (5): After winning, gain loot! | Briar, Jinx, Aurora, Illaoi, Fiora |
| Arbiter | 2 / 3 | Scribe a unique divine law — choose a cause and effect for Arbiters. (3): Effects are stronger. | Leona, Zoe, Diana, LeBlanc |
| Dark Star | 2 / 4 / 6 / 9 | (2): Create a black hole that consumes enemies at 10% max HP. (4): +40% effectiveness. (6): Strongest Dark Star goes supermassive (100% effectiveness, 2 minor black holes). (9): All supermassive. At level 10, CONSUME EVERYONE. | Cho'Gath, Lissandra, Mordekaiser, Kai'Sa, Karma, Jhin |
| Mecha | 3 / 4 / 6 | Mecha units can transform into Ultimate form. (3): 20% damage amp. (4): 35% damage amp. (6): +1 max team size. | Urgot, Aurelion Sol, The Mighty Mech |
| Meeple | 3 / 5 / 7 / 10 | Attract Meeps that empower abilities. (3): 2 Meeps, 2%, 125 HP. (5): 3 Meeps, 3%, 250 HP. (7): 4 Meeps, 4%, 400 HP + Cloning Slot. (10): 6 Meeps, 6%, 500 HP + SUMMON THE FOUR MEEPLORDS! | Poppy, Veigar, Gnar, Meepsie, Fizz, Corki, Rammus, Bard |
| N.O.V.A. | 2 / 5 | 6 seconds into combat, grant a power surge. (5): Gain Striker selector. | Aatrox, Caitlyn, Akali, Maokai, Kindred |
| Primordian | 2 / 3 | 8% damage taken → damage dealt. (2): Spawn Swarmlings. (3): 45% more Swarmlings + gain random champ each round. | Briar, Rek'Sai, Bel'Veth |
| Psionic | 2 / 4 | Gain Psionic items. (4): If holder is Psionic, items gain extra effects. | Gragas, Pyke, Viktor, Master Yi, Sona |
| Space Groove | 1 / 3 / 5 / 7 / 10 | Groovians enter The Groove. (3): Start in Groove 3s. (5): +3% stacking AD/AP per second. (7): +10% all effects. (10): THE GROOVE. | Nasus, Teemo, Gwen, Ornn, Samira, Nami, Blitzcrank |
| Stargazer | 3 / 5 / 7 | Chart different constellation each game. Stargazers in empowered hexes gain bonuses. | Talon, Twisted Fate, Jax, Lulu, Nunu, Xayah |
| Timebreaker | 2 / 3 / 4 | (2): Lose → free rerolls; Win → store XP. (3): +15% AS. (4): Timebreakers gain 50% AS. | Ezreal, Milio, Pantheon, Riven |

### Unique Origins (1 breakpoint each)
| Trait | Champion | Effect |
|-------|----------|--------|
| Bulwark | Shen | Summon a placeable relic. Combat start: grants adjacent allies 10% max HP Shield and 10% AS. |
| Commander | Sona | Gain a random Command Mod every 2 rounds to alter ally combat behavior. |
| Dark Lady | Morgana | Allies take 5% less ability damage, increased to 10% while Morgana is in Dark Form. |
| Divine Duelist | Fiora | Tactician heals 15% of player damage from winning. Fiora always wins a 1v1 duel. |
| Doomer | Vex | Combat Start: Mark all enemies with Doom. First damage steals 12% AD & AP for Vex. |
| Eradicator | Jhin | Enemies have 10% less Armor and Magic Resist. |
| Factory New | Graves | After combat, open an armory for permanent upgrade for Graves. |
| Galaxy Hunter | Zed | While at least one clone is alive, Zed gains 40% bonus AD. |
| Gun Goddess | Miss Fortune | Choose between Conduit, Challenger, or Replicator Mode. |
| Oracle | Tahm Kench | Every 3 rounds, Tahm Kench grants a reward! |
| Party Animal | Blitzcrank | At 45% HP, become untargetable and repair 15% max HP/s. At full HP, enter The Groove. |
| Redeemer | Rhaast | For each non-unique active trait, team gains 2%/3%/4% AS and 2/2.5/3 Armor & MR. |

### Classes
| Trait | Breakpoints | Effect | Champions |
|-------|------------|--------|-----------|
| Bastion | 2 / 4 / 6 | Team gains 12 Armor & MR. Bastions gain more, doubled first 10s. (2): +16. (4): +35. (6): +60 + non-Bastions gain 20. | Aatrox, Poppy, Jax, Ornn, Rammus, Shen |
| Brawler | 2 / 4 / 6 | Team gains 7% HP. Brawlers gain more. (2): +25%. (4): +45%. (6): +65%. | Cho'Gath, Rek'Sai, Gragas, Pantheon, Maokai, Urgot, Tahm Kench |
| Challenger | 2 / 3 / 4 / 5 | Team gains 10% AS. On kill, dash + 50% AS 2.5s. (2): 15%. (3): 22%. (4): 30%. (5): 40%. | Bel'Veth, Jinx, Diana, Kindred |
| Conduit | 2 / 4 | Innate: +20% Mana from all sources. Team gains Mana Regen. (2): 1/3. (4): 2/5. | Mordekaiser, Zoe, Viktor, Aurelion Sol, Bard |
| Fateweaver | 2 / 4 | Innate: Precision (ability dmg can crit). (2): Lucky chance effects. (4): +20% Crit Chance & Damage, crits are Lucky. | Caitlyn, Twisted Fate, Milio, Corki |
| Marauder | 2 / 4 / 6 | 5% Omnivamp. Overhealing → Shield. (2): 5%, 20% AD. (4): 7%, 40% AD. (6): 10%, 60% AD. | Akali, Bel'Veth, Urgot, Master Yi, Fiora |
| Replicator | 2 / 4 | Abilities occur a second time at reduced effectiveness. (2): 22%. (4): 45%. | Lissandra, Veigar, Pantheon, Lulu, Nami |
| Rogue | 2 / 3 / 4 / 5 | Gain AD & AP. At 50% HP, slip into shadows. (2): 15%. (3): 30%. (4): 45%. (5): 60%. | Briar, Talon, Gwen, Fizz, Kai'Sa, Riven |
| Shepherd | 3 / 5 / 7 | Summon Bond of the Stars. (3): Summon Bia. (5): Summon Bayin. (7): Bond grows deeper. | Lissandra, Teemo, Meepsie, Illaoi, LeBlanc, Sona |
| Sniper | 2 / 3 / 4 | Damage Amp per hex. (2): 18% +2%/hex. (3): 24% +3%/hex. (4): 28% +4%/hex. | Ezreal, Gnar, Samira, Xayah, Jhin |
| Vanguard | 2 / 4 / 6 | 5% Durability while Shielded. Shield at combat start & 50% HP. (2): 16%. (4): 28%. (6): 40% + 10% DR. | Leona, Nasus, Mordekaiser, Illaoi, Nunu, Blitzcrank |
| Voyager | 2 / 3 / 4 / 5 / 6 | Tanks get Shield, others get Damage Amp. Voyagers double. (2): 175, 9%. (3): 250, 15%. (4): 350, 18%. (5): 500, 22%. (6): 700, 27%. | Meepsie, Pyke, Aurora, Karma, The Mighty Mech |

### Emblems (non-unique classes)
Bastion, Brawler, Challenger, Conduit, Fateweaver, Marauder, Replicator, Rogue, Shepherd, Sniper, Vanguard, Voyager
