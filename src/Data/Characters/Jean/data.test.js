import { applyArtifacts, computeAllStats, createProxiedStats } from "../TestUtils"
import formula from "./data"

let setupStats

// Discord ID: 754914627246358610
describe("Testing Jean's Formulas (Saber#9529)", () => {
  beforeEach(() => { setupStats = createProxiedStats({
    characterHP: 14695, characterATK: 239, characterDEF: 769,
    characterEle: "anemo", characterLevel: 90,
    weaponType: "sword", weaponATK: 674,
  
    heal_: 22.2,
    atk_: 20, physical_dmg_: 41.3, // Weapon
  
    talentLevelKeys: Object.freeze({ auto: 9 - 1, skill: 8 - 1, burst: 6 - 1 }),
  }) })

  describe("with artifacts", () => {
    beforeEach(() => applyArtifacts(setupStats, [
      { hp: 4780, critDMG_: 12.4, critRate_: 9.7, hp_: 4.1, def: 58 }, // Flower of Life
      { atk: 311, critRate_: 10.5, def: 19, critDMG_: 19.4, hp_: 4.7 }, // Plume of Death
      { atk_: 46.6, def_: 12.4, critDMG_: 22.5, hp: 478, enerRech_: 10.4 }, // Sands of Eon
      { atk_: 46.6, critDMG_: 27.2, def_: 5.8, eleMas: 23, critRate_: 6.6 }, // Goblet of Eonothem
      { critRate_: 31.1, enerRech_: 13, hp_: 14, hp: 299, eleMas: 56 }, // Circlet of Logos
      { atk_: 18, physical_dmg_: 25 }, // Gladiators 2set + Bloodstained 2set
    ]))

    test("overall stats", () => {
      const stats = computeAllStats(setupStats)
      expect(stats.finalHP).toApproximate(14695 + 8897)
      expect(stats.finalATK).toApproximate(914 + 1510)
      expect(stats.finalDEF).toApproximate(769 + 216)
      expect(stats.eleMas).toApproximate(79)
      expect(stats.critRate_).toApproximate(62.9)
      expect(stats.critDMG_).toApproximate(131.6)
      expect(stats.enerRech_).toApproximate(123.3)
      expect(stats.anemo_dmg_).toApproximate(0)
      expect(stats.physical_dmg_).toApproximate(66.3)
    })

    test("healing", () => {
      const stats = computeAllStats(setupStats), { burst } = stats.talentLevelKeys
      expect(formula.burst.heal(burst, stats)[0](stats)).toApproximate(13388)
      expect(formula.burst.regen(burst, stats)[0](stats)).toApproximate(1338)

      expect(formula.passive1.heal(undefined, stats)[0](stats)).toApproximate(443)
    })

    describe("swirl", () => {
      test("reaction", () => {
        const stats = computeAllStats(setupStats)
        expect(stats.pyro_swirl_hit).toApproximate(881)
        expect(stats.cryo_swirl_hit).toApproximate(881)
        expect(stats.electro_swirl_hit).toApproximate(881)
        expect(stats.hydro_swirl_hit).toApproximate(881)
      })
    })
    describe("swirl with 51EM", () => {
      beforeEach(() => setupStats.eleMas = 51)

      test("reaction", () => {
        const stats = computeAllStats(setupStats)
        expect(stats.pyro_swirl_hit).toApproximate(802)
        expect(stats.cryo_swirl_hit).toApproximate(802)
        expect(stats.electro_swirl_hit).toApproximate(802)
        expect(stats.hydro_swirl_hit).toApproximate(802)
      })
    })

    describe("no crit", () => {
      beforeEach(() => setupStats.hitMode = "hit")

      describe("Ruin Guard lvl 85", () => {
        beforeEach(() => {
          setupStats.enemyLevel = 85
          setupStats.physical_enemyRes_ = 70
        })

        test("hits", () => {
          const stats = computeAllStats(setupStats), { auto, skill, burst } = stats.talentLevelKeys
          expect(formula.normal[0](auto, stats)[0](stats)).toApproximate(544)
          expect(formula.normal[1](auto, stats)[0](stats)).toApproximate(513)
          expect(formula.normal[2](auto, stats)[0](stats)).toApproximate(678)
          expect(formula.normal[3](auto, stats)[0](stats)).toApproximate(741)
          expect(formula.normal[4](auto, stats)[0](stats)).toApproximate(891)

          expect(formula.charged.dmg(auto, stats)[0](stats)).toApproximate(1823)

          expect(formula.plunging.dmg(auto, stats)[0](stats)).toApproximate(719)
          expect(formula.plunging.low(auto, stats)[0](stats)).toApproximate(1438)
          expect(formula.plunging.high(auto, stats)[0](stats)).toApproximate(1797)

          expect(formula.skill.dmg(skill, stats)[0](stats)).toApproximate(5162)
          expect(formula.skill.dmg_hold(skill, stats)[0](stats)).toApproximate(7226)
        })
      })
    })

    describe("crit", () => {
      beforeEach(() => setupStats.hitMode = "critHit")

      describe("Ruin Guard lvl 85", () => {
        beforeEach(() => {
          setupStats.enemyLevel = 85
          setupStats.physical_enemyRes_ = 70
        })

        test("hits", () => {
          const stats = computeAllStats(setupStats), { auto, skill, burst } = stats.talentLevelKeys
          expect(formula.normal[0](auto, stats)[0](stats)).toApproximate(1259)
          expect(formula.normal[1](auto, stats)[0](stats)).toApproximate(1188)
          expect(formula.normal[2](auto, stats)[0](stats)).toApproximate(1571)
          expect(formula.normal[3](auto, stats)[0](stats)).toApproximate(1717)
          expect(formula.normal[4](auto, stats)[0](stats)).toApproximate(2064)

          expect(formula.charged.dmg(auto, stats)[0](stats)).toApproximate(4223)

          expect(formula.plunging.dmg(auto, stats)[0](stats)).toApproximate(1666)
          expect(formula.plunging.low(auto, stats)[0](stats)).toApproximate(3332)
          expect(formula.plunging.high(auto, stats)[0](stats)).toApproximate(4162)

          expect(formula.skill.dmg(skill, stats)[0](stats)).toApproximate(11954)
          expect(formula.skill.dmg_hold(skill, stats)[0](stats)).toApproximate(16736)

          expect(formula.burst.skill(burst, stats)[0](stats)).toApproximate(15217)
          expect(formula.burst.field_dmg(burst, stats)[0](stats)).toApproximate(2808)
        })
      })
    })
  })
})

// Discord ID: 822256929929822248
describe("Testing Jean's Formulas (sohum#5921)", () => {
  beforeEach(() => { setupStats = createProxiedStats({
    characterHP: 9533, characterATK: 155, characterDEF: 499,
    characterEle: "anemo", characterLevel: 60,
    weaponType: "sword", weaponATK: 347,
  
    heal_: 11.1, enerRech_: 100 + 50.5,
    enemyLevel: 85, physical_enemyRes_: 70, // Ruin Guard
  
    talentLevelKeys: Object.freeze({ auto: 1 - 1, skill: 1 - 1, burst: 1 - 1 }),
  }) })

  describe("with artifacts", () => {
    beforeEach(() => applyArtifacts(setupStats, [
      { hp: 3967, atk_: 9.3, atk: 16, critDMG_: 13.2, hp_: 10.5,  }, // Flower of Life
      { atk: 258, critDMG_: 7, def: 81, critRate_: 3.9, hp: 239,  }, // Plume of Death
      { enerRech_: 29.8, critDMG_: 6.2, hp: 209, eleMas: 19, atk: 16 }, // Sands of Eon
      { anemo_dmg_: 30.8, hp: 448, eleMas: 40, critRate_: 3.9, def: 21 }, // Goblet of Eonothem
      { critRate_: 25.8, hp: 478, critDMG_: 7, atk_: 13.4, atk: 35, }, // Circlet of Logos
      { eleMas: 80 }, // 2 Wanderer's Troupe
    ]))

    test("heal", () => {
      const stats = computeAllStats(setupStats), { burst } = stats.talentLevelKeys
      expect(formula.burst.regen(burst, stats)[0](stats)).toApproximate(433)
      expect(formula.passive1.heal(undefined, stats)[0](stats)).toApproximate(156)
    })
    test("reactions", () => {
      const stats = computeAllStats(setupStats)
      expect(stats.cryo_swirl_hit).toApproximate(423)
    })
    describe("no crit", () => {
      beforeEach(() => setupStats.hitMode = "hit")

      test("hit", () => {
        const stats = computeAllStats(setupStats), { auto, skill, burst } = stats.talentLevelKeys
        expect(formula.normal[0](auto, stats)[0](stats)).toApproximate(63)
        expect(formula.normal[1](auto, stats)[0](stats)).toApproximate(59)
        expect(formula.normal[2](auto, stats)[0](stats)).toApproximate(78)
        expect(formula.normal[3](auto, stats)[0](stats)).toApproximate(86)
        expect(formula.normal[4](auto, stats)[0](stats)).toApproximate(103)
        expect(formula.charged.dmg(auto, stats)[0](stats)).toApproximate(211)
        expect(formula.skill.dmg(skill, stats)[0](stats)).toApproximate(1498)
        expect(formula.burst.skill(burst, stats)[0](stats)).toApproximate(2180)
        expect(formula.burst.field_dmg(burst, stats)[0](stats)).toApproximate(402)
      })
    })

    describe("crit", () => {
      beforeEach(() => setupStats.hitMode = "critHit")

      test("hit", () => {
        const stats = computeAllStats(setupStats), { auto, skill, burst } = stats.talentLevelKeys
        expect(formula.normal[0](auto, stats)[0](stats)).toApproximate(115)
        expect(formula.normal[1](auto, stats)[0](stats)).toApproximate(109)
        expect(formula.normal[2](auto, stats)[0](stats)).toApproximate(144)
        expect(formula.normal[4](auto, stats)[0](stats)).toApproximate(189)
        expect(formula.skill.dmg(skill, stats)[0](stats)).toApproximate(2748)
        expect(formula.burst.skill(burst, stats)[0](stats)).toApproximate(3998)
        expect(formula.burst.field_dmg(burst, stats)[0](stats)).toApproximate(737)
      })
    })
  })
})
