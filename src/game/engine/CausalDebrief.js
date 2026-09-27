import { POSITIONS_DATA, BONDS_DATA, EDICTS_DATA } from '../data/rules.js';

export class CausalDebrief {
  /**
   * Analyzes the battle result from CombatEngine and extracts 1-3 critical cause-chains
   */
  static analyze(simulationResult, setup) {
    const { winner, duration, events, metrics, finalAllies, finalEnemies } = simulationResult;
    const { formation, bond, edict } = setup;

    const frontHero = formation[0];
    const coreHero = formation[1];
    const rearHero = formation[2];

    const chains = [];

    // 1. Formation Analysis (FRONT / REAR positioning impact)
    if (frontHero === 'vael') {
      chains.push({
        type: 'formation',
        good: true,
        title: '외피(FRONT) 안정',
        text: '베일이 전열에서 첫 충돌을 묵직하게 받아내어 후방의 집중 시간을 벌어주었습니다.',
      });
    } else {
      const frontHeroName = finalAllies[frontHero]?.name ?? '아군';
      chains.push({
        type: 'formation',
        good: false,
        title: '외피(FRONT) 노출',
        text: `${frontHeroName}이(가) 전열에서 큰 물리 충돌을 직접 맞아 조기에 치명상을 입었습니다.`,
      });
    }

    // 2. Resonance Analysis (Bond execution)
    if (bond === 'vael_seris') {
      if (metrics.interceptCount > 0) {
        chains.push({
          type: 'bond',
          good: true,
          title: '수호의 월식 (INTERCEPT)',
          text: `베일이 세리스를 향한 저격을 ${metrics.interceptCount}회 가로막아(${Math.round(metrics.interceptDamageAbsorbed)} 경감) 월광 의식 중단을 방지했습니다.`,
        });
      } else {
        chains.push({
          type: 'bond',
          good: true,
          title: '수호 태세 유지',
          text: '후열을 향한 직접적인 저격이 없었으나, 베일의 수호 반경 내에서 안전이 확보되었습니다.',
        });
      }
    } else if (bond === 'vael_mirel') {
      if (metrics.emergencyHealFired) {
        chains.push({
          type: 'bond',
          good: true,
          title: '철화의 맹세 (긴급 회복)',
          text: '베일의 위기 순간 미렐의 긴급 꽃맥박과 철화 방벽이 발동하여 전열 붕괴를 막았습니다.',
        });
      } else {
        chains.push({
          type: 'bond',
          good: true,
          title: '순환 유지',
          text: '미렐의 꽃맥박이 베일의 보호막과 연계되어 견고한 전열 방어선을 유지했습니다.',
        });
      }
    } else if (bond === 'seris_mirel') {
      if (metrics.moonlightBloomFired && metrics.serisRitualCompleted) {
        chains.push({
          type: 'bond',
          good: true,
          title: '월화 개화 (의식 가속)',
          text: '미렐의 생명력과 공명하여 세리스의 월광 의식이 35% 빠르게 완성되고 폭발 피해가 증폭되었습니다.',
        });
      }
    }

    // 3. Edict Analysis
    if (edict === 'shell') {
      chains.push({
        type: 'edict',
        good: true,
        title: '명령 · 껍질을 닫아',
        text: '초기 3.5초간의 25% 피해 경감 효과로 적의 초반 맹공을 안정적으로 흡수했습니다.',
      });
    } else if (edict === 'moon') {
      if (metrics.serisRitualCompleted) {
        chains.push({
          type: 'edict',
          good: true,
          title: '명령 · 달을 끝까지 띄워',
          text: '즉시 착수한 월광 의식이 +40% 증폭된 폭발로 적 진형 전체를 일거에 정리했습니다.',
        });
      } else {
        chains.push({
          type: 'edict',
          good: false,
          title: '명령 · 과도한 노출',
          text: '월광 완성을 서두르다 세리스가 적의 집중 공격에 노출되었습니다.',
        });
      }
    } else if (edict === 'roots') {
      chains.push({
        type: 'edict',
        good: true,
        title: '명령 · 뿌리를 깊게',
        text: `미렐이 동료들의 미세한 상처를 조기에 감지하여 총 ${metrics.totalHealingDone}의 생명력을 지속 보충했습니다.`,
      });
    }

    // Determine Overall Grade and Narrative Summary
    const allyDowns = Object.values(finalAllies).filter((a) => a.downed).length;
    let grade = 'clean';
    let headline = '';

    if (winner === 'ally') {
      if (allyDowns === 0 && metrics.serisRitualCompleted) {
        grade = 'mastery';
        headline = '완벽한 생태계 호흡: 한 명의 이탈 없이 교전을 종결했습니다.';
      } else if (allyDowns === 0) {
        grade = 'clean';
        headline = '안정적인 승리: 설계된 반응 사슬이 질서 있게 작동했습니다.';
      } else {
        grade = 'pyrrhic';
        headline = '상처 입은 승리: 적을 쓰러뜨렸으나 소중한 동료가 상처를 입었습니다.';
      }
    } else {
      grade = 'collapse';
      headline = '방어선 붕괴: 적의 의도에 대응하지 못하고 카라반이 와해되었습니다.';
    }

    // Return the top 3 decisive cause items
    const topChains = chains.slice(0, 3);

    return {
      winner,
      duration,
      grade,
      headline,
      chains: topChains,
      metrics,
      advice: this.getAdaptationAdvice(grade, setup, metrics),
    };
  }

  static getAdaptationAdvice(grade, setup, metrics) {
    if (setup.formation[0] !== 'vael') {
      return '다음 교전에서는 전열(FRONT)에 베일을 배치해 충돌 흡수율을 높여보세요.';
    }
    if (!setup.bond) {
      return '공명을 활성화하면 동료들이 조건에 따라 스스로 개입하고 치유합니다.';
    }
    if (grade === 'pyrrhic' || grade === 'collapse') {
      return '적의 저격과 돌진이 거세다면 [껍질을 닫아] 명령으로 초기 급습을 버텨내는 것이 유리합니다.';
    }
    return '현재 편성이 매우 조화롭습니다. 다음 여정의 새로운 위협에 맞게 변주를 시도해 보세요.';
  }
}
