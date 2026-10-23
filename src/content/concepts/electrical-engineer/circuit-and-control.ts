import type { ConceptChapter } from "@/types/concept";

/** 회로이론 및 제어공학 — 시하끝하 전기기사 필기 회로이론 필수개념 01~43, 제어공학 필수개념 01~20 요약 */
export const CIRCUIT_AND_CONTROL_CHAPTERS: ConceptChapter[] = [
  {
    id: "dc-circuit",
    title: "직류회로",
    cards: [
      {
        id: "current-voltage-resistance",
        title: "전류, 전압, 저항",
        body: `직류는 시간이 지나도 극성이 일정하고, 교류는 극성이 주기적으로 바뀐다.

| 구분 | 공식 및 단위 | 의미 |
| --- | --- | --- |
| 전류 $I$ [A] | $I = \\frac{Q}{t}$ [C/s = A], $Q = It$ [A·s = C] | 단위 시간 동안 도체 단면을 지나는 전하량 |
| 전압 $V$ [V] | $V = \\frac{W}{Q}$ [J/C = V], $W = QV$ [J] | 전기적 위치에너지 차이로 전류를 흐르게 하는 힘 |
| 저항 $R$ [Ω] | $R = \\rho\\frac{l}{A}$ [Ω] | 전류의 흐름을 방해하는 성질 |

- $\\rho$: 고유저항, $l$: 길이, $A$: 단면적
- 저항은 고유저항·길이에 **비례**, 단면적에 **반비례**`,
      },
      {
        id: "ohms-law",
        title: "옴의 법칙",
        body: `전기회로에서 전압·전류·저항 사이의 관계.

$$
V = IR\\ [\\mathrm{V}], \\quad I = \\frac{V}{R}\\ [\\mathrm{A}], \\quad R = \\frac{V}{I}\\ [\\Omega]
$$

- 전류는 전원의 (+)극에서 나와 (−)극으로 들어간다
- 전류가 순환할 수 있게 만든 경로가 전기회로`,
      },
      {
        id: "kirchhoffs-laws",
        title: "키르히호프의 법칙",
        body: `**제1법칙 – 전류법칙(KCL)**: 임의의 접속점에서 들어오는 전류의 합 = 나가는 전류의 합

$$
I_1 - I_2 - I_3 - I_4 = 0 \\;\\Rightarrow\\; I_1 = I_2 + I_3 + I_4
$$

**제2법칙 – 전압법칙(KVL)**: 임의의 폐회로에서 공급전압의 합 = 전압강하의 합

$$
V = V_{R1} + V_{R2} + V_{R3}
$$

- 시험에서 직접 묻기보다 회로 문제를 푸는 기본 도구로 쓰인다`,
      },
      {
        id: "resistor-connection",
        title: "저항의 접속",
        body: `**직렬**: 모든 구간에 같은 전류가 흐르고, 전압은 저항에 **비례**해 나뉜다.

- $I = I_1 = I_2$, $V = V_1 + V_2$, $R_T = R_1 + R_2$
- 전압 분배: $V_1 = V \\times \\frac{R_1}{R_1 + R_2}$, $V_2 = V \\times \\frac{R_2}{R_1 + R_2}$

**병렬**: 모든 구간에 같은 전압이 걸리고, 전류는 저항에 **반비례**해 나뉜다.

- $V = V_1 = V_2$, $I = I_1 + I_2$
- $R_T = \\frac{1}{\\frac{1}{R_1} + \\frac{1}{R_2}} = \\frac{R_1 R_2}{R_1 + R_2}$, $V = IR_T = I \\times \\frac{R_1 R_2}{R_1 + R_2}$
- 전류 분배: $I_1 = I \\times \\frac{R_2}{R_1 + R_2}$, $I_2 = I \\times \\frac{R_1}{R_1 + R_2}$ (반대쪽 저항이 분자)`,
      },
      {
        id: "wheatstone-bridge",
        title: "휘스톤 브리지 회로",
        body: `저항 네 개를 브리지 형태로 연결해 **미지의 저항값**을 측정하는 회로.

$$
R_1 R_4 = R_2 R_3 \\;\\Rightarrow\\; I_g = 0
$$

- 평형 조건(마주 보는 저항의 곱이 같음)이 성립하면 검류계 전류 $I_g = 0$
- 시험: 저항 세 개가 주어지고 나머지 하나를 구하는 문제
- 실무: 선로의 고장점 측정에 이 원리가 쓰인다`,
      },
      {
        id: "power-and-energy",
        title: "전력과 전력량",
        body: `**전력**: 단위 시간 동안 전기 에너지가 하는 일

$$
P = \\frac{W}{t}\\ [\\mathrm{J/s = W}] = \\frac{QV}{t} = VI = I^2 R = \\frac{V^2}{R}\\ [\\mathrm{W}]
$$

**전력량**: 일정 시간 동안 사용한 전력의 양

$$
W = Pt\\ [\\mathrm{W \\cdot s = J}] = VIt\\ [\\mathrm{J}]
$$

- 직렬 연결: 전류가 일정 → $P = I^2 R$ 사용
- 병렬 연결: 전압이 일정 → $P = \\frac{V^2}{R}$ 사용`,
      },
    ],
  },
  {
    id: "sinusoidal-ac",
    title: "정현파 교류",
    cards: [
      {
        id: "sinusoidal-magnitude",
        title: "정현파 교류의 크기 표시",
        body: `정현파 교류는 시간에 따라 sin 함수 꼴로 연속 변하는 교류이다.

**순시값** (특정 순간의 크기)

- $v(t) = V_m \\sin(\\omega t \\pm \\theta) = \\sqrt{2}\\, V \\sin(2\\pi f t \\pm \\theta)$ [V]
- $i(t) = I_m \\sin(\\omega t \\pm \\theta) = \\sqrt{2}\\, I \\sin(2\\pi f t \\pm \\theta)$ [A]

**실효값** (저항에서 같은 열을 내는 직류로 환산한 값)

$$
I = \\sqrt{\\frac{1}{T}\\int_0^T i^2(t)\\,dt} = 0.707 I_m = \\frac{I_m}{\\sqrt{2}}
$$

**평균값** (반주기 파형 면적 ÷ 반주기)

$$
I_a = \\frac{1}{T/2}\\int_0^{T/2} i(t)\\,dt = 0.637 I_m = \\frac{2}{\\pi} I_m
$$

- 호도법 ↔ 각도법: $\\frac{\\pi}{6} = 30°$, $\\frac{\\pi}{4} = 45°$, $\\frac{\\pi}{3} = 60°$, $\\frac{\\pi}{2} = 90°$, $\\pi = 180°$, $1$[rad] $= 57.3°$
- 위상차는 전압·전류를 같은 삼각함수(보통 sin)로 통일한 뒤 계산: $\\cos\\theta = \\sin(\\theta + 90°)$
- $v(t) = 100\\sqrt{2}\\sin(\\omega t + 60°)$의 표현: 극형식 $V = 100\\angle 60°$, 지수함수 $100e^{j60°}$, 삼각함수 $100(\\cos 60° + j\\sin 60°)$, 복소수 $50 + j50\\sqrt{3}$ (모두 **실효값** 기준)
- 극형식 곱셈은 크기끼리 곱하고 각도는 더하기, 나눗셈은 크기끼리 나누고 각도는 빼기: $\\frac{20\\angle 30°}{5\\angle 60°} = 4\\angle -30°$`,
      },
      {
        id: "waveform-comparison",
        title: "파형의 특성 비교",
        body: `| 파형 | 실효값 | 평균값 | 파고율 | 파형률 |
| --- | --- | --- | --- | --- |
| 정현파(전파) | $\\frac{I_m}{\\sqrt{2}}$ | $\\frac{2I_m}{\\pi}$ | $\\sqrt{2}$ | $1.11$ |
| 반파 정현파 | $\\frac{I_m}{2}$ | $\\frac{I_m}{\\pi}$ | $2$ | $1.57$ |
| 삼각파(톱니파) | $\\frac{I_m}{\\sqrt{3}}$ | $\\frac{I_m}{2}$ | $\\sqrt{3}$ | $1.155$ |
| 구형파 | $I_m$ | $I_m$ | $1$ | $1$ |
| 반파 구형파 | $\\frac{I_m}{\\sqrt{2}}$ | $\\frac{I_m}{2}$ | $\\sqrt{2}$ | $1.414$ |

- 최댓값은 모두 $I_m$, 전압·전류 모두 적용
- **파고율** $= \\frac{\\text{최댓값}}{\\text{실효값}}$ → 파형이 얼마나 뾰족한지
- **파형률** $= \\frac{\\text{실효값}}{\\text{평균값}}$ → 파형이 얼마나 완만한지
- 파고율은 실효값 분모의 역수로 보면 외우기 쉽다`,
      },
    ],
  },
  {
    id: "ac-circuit",
    title: "교류회로",
    cards: [
      {
        id: "r-l-c-elements",
        title: "R(저항), L(인덕턴스), C(정전용량)",
        body: `| 소자 | 위상 관계 | 임피던스 |
| --- | --- | --- |
| 저항 $R$ [Ω] | 전압·전류 **동상** | $Z = R$ [Ω] |
| 인덕턴스 $L$ [H] | 전류가 전압보다 90° **느림** → 지상(유도성) | $Z = jX_L = j\\omega L$ [Ω] |
| 커패시턴스 $C$ [F] | 전류가 전압보다 90° **빠름** → 진상(용량성) | $Z = -jX_C = -j\\frac{1}{\\omega C}$ [Ω] |

**임피던스**: 전류를 방해하는 성분 전체

$$
Z = R + jX_L - jX_C = R + j(X_L - X_C)
$$

- 허수 $j = \\sqrt{-1}$: 곱하면 복소평면에서 반시계 방향 90° 회전
- $j^2 = -1$, $j^3 = -j$, $j^4 = 1$, $\\frac{1}{j} = -j$`,
      },
      {
        id: "rlc-series",
        title: "RLC 직렬 회로",
        body: `| 구분 | $RL$ 직렬 | $RC$ 직렬 | $RLC$ 직렬 |
| --- | --- | --- | --- |
| 임피던스 | $R + jX_L$ | $R - jX_C$ | $R + j(X_L - X_C)$ |
| 크기 $\\lvert Z \\rvert$ | $\\sqrt{R^2 + X_L^2}$ | $\\sqrt{R^2 + X_C^2}$ | $\\sqrt{R^2 + (X_L - X_C)^2}$ |
| 전압 | $V_R + jV_L$ | $V_R - jV_C$ | $V_R + j(V_L - V_C)$ |
| 위상차 $\\theta$ | $\\tan^{-1}\\frac{\\omega L}{R}$ | $\\tan^{-1}\\frac{1}{\\omega CR}$ | $\\tan^{-1}\\frac{X_L - X_C}{R}$ |

- 전류: $I = \\frac{V}{Z} = \\frac{V}{\\lvert Z \\rvert}$ [A]
- 역률: $\\cos\\theta = \\frac{R}{Z}$ (예: $RL$ 직렬 $\\frac{R}{\\sqrt{R^2 + X_L^2}}$)
- 직렬은 **임피던스**로 해석한다`,
      },
      {
        id: "rlc-parallel",
        title: "RLC 병렬 회로",
        body: `**$RL$ 병렬**

- $Z = \\frac{R \\times jX_L}{R + jX_L}$, $\\lvert Z \\rvert = \\frac{R X_L}{\\sqrt{R^2 + X_L^2}}$ [Ω], $I = I_R - jI_L$ [A]
- 역률 $\\cos\\theta = \\frac{Z}{R} = \\frac{X_L}{\\sqrt{R^2 + X_L^2}}$, 위상차 $\\theta = \\tan^{-1}\\frac{R}{X_L} = \\tan^{-1}\\frac{R}{\\omega L}$

**$RC$ 병렬**

- $Z = \\frac{R \\times (-jX_C)}{R + (-jX_C)}$, $\\lvert Z \\rvert = \\frac{R X_C}{\\sqrt{R^2 + X_C^2}}$ [Ω], $I = I_R + jI_C$ [A]
- 역률 $\\cos\\theta = \\frac{Z}{R} = \\frac{X_C}{\\sqrt{R^2 + X_C^2}}$, 위상차 $\\theta = \\tan^{-1}\\frac{R}{X_C} = \\tan^{-1}(\\omega CR)$

**$RLC$ 병렬** — 어드미턴스로 해석

$$
Y = \\frac{1}{R} + \\frac{1}{jX_L} + \\frac{1}{-jX_C} = \\frac{1}{R} + j\\left(\\frac{1}{X_C} - \\frac{1}{X_L}\\right)
$$

- $\\lvert Y \\rvert = \\sqrt{\\left(\\frac{1}{R}\\right)^2 + \\left(\\frac{1}{X_C} - \\frac{1}{X_L}\\right)^2}$, $I = I_R + j(I_C - I_L)$
- 병렬 역률이 $\\frac{Z}{R}$인 이유: 직렬은 임피던스, 병렬은 **어드미턴스** 삼각형으로 보기 때문 ($\\cos\\theta = \\frac{1/R}{1/Z} = \\frac{Z}{R}$)`,
      },
      {
        id: "rlc-series-resonance",
        title: "RLC 직렬 공진 회로",
        body: `$RLC$ 직렬 회로에서 $X_L = X_C$가 되는 상태.

| 공진 조건 | 공진 주파수 | 임피던스 | 전류 | 역률 |
| --- | --- | --- | --- | --- |
| $X_L = X_C$ | $f_0 = \\frac{1}{2\\pi\\sqrt{LC}}$ [Hz] | 최소 | 최대 | 1 |

**전압 확대율(첨예도, 선택도)** $Q$: $L$·$C$에 걸리는 전압이 공급전압의 몇 배인지

$$
Q = \\frac{V_L}{V} = \\frac{\\omega L}{R} = \\frac{V_C}{V} = \\frac{1/\\omega C}{R} \\;\\Rightarrow\\; Q = \\frac{1}{R}\\sqrt{\\frac{L}{C}}
$$

- 두 식을 곱하면 $Q^2 = \\frac{L}{R^2 C}$`,
      },
      {
        id: "inductance-connection",
        title: "인덕턴스의 접속",
        body: `| 접속 | 가동(자속 방향 동일) | 차동(자속 방향 반대) |
| --- | --- | --- |
| 직렬 | $L = L_1 + L_2 + 2M$ | $L = L_1 + L_2 - 2M$ |
| 병렬 | $L = \\frac{L_1 L_2 - M^2}{L_1 + L_2 - 2M}$ | $L = \\frac{L_1 L_2 - M^2}{L_1 + L_2 + 2M}$ |

**상호 인덕턴스** $M$: 한 코일의 전류 변화로 생긴 자속이 다른 코일에 영향을 주는 성질

- $M = k\\sqrt{L_1 L_2}$ [H], 결합 계수 $k = \\frac{M}{\\sqrt{L_1 L_2}}$ $(0 \\le k \\le 1)$

**에너지**

- 인덕터: $W = \\frac{1}{2}LI^2$ [J]
- 커패시터: $W = \\frac{1}{2}QV = \\frac{1}{2}CV^2$ [J]`,
      },
    ],
  },
  {
    id: "single-phase-ac-power",
    title: "단상 교류 전력",
    cards: [
      {
        id: "active-reactive-apparent-power",
        title: "유효전력, 무효전력, 피상전력",
        body: `유효전력은 저항에서 실제로 소비되는 전력, 무효전력은 전원과 부하 사이를 오가며 에너지 교환만 하는 전력, 피상전력은 둘의 벡터합인 전체 전력이다.

| 구분 | 식 | 단위 |
| --- | --- | --- |
| 유효전력(소비·평균전력) | $P = I^2R = \\frac{V^2}{R} = VI\\cos\\theta = P_a\\cos\\theta$ | [W] |
| 무효전력 | $P_r = I^2X = \\frac{V^2}{X} = VI\\sin\\theta = P_a\\sin\\theta$ | [Var] |
| 피상전력 | $P_a = P + jP_r$, $\\lvert P_a \\rvert = \\sqrt{P^2 + P_r^2}$ | [VA] |

$$
\\cos\\theta = \\frac{P}{P_a} = \\frac{P}{\\sqrt{P^2 + P_r^2}}
$$

- 역률: 피상전력에 대한 유효전력의 비율 (전력 이용 효율)
- 복소전력: $P_a = V I^* = P \\pm jP_r$ — 전류에 공액(허수 부호 반전)을 취해 계산
  - 허수부 (+) → **유도성** 무효전력, (−) → **용량성** 무효전력
- 전력용 콘덴서 용량처럼 순수 무효전력만 있을 때는 [VA]로 표기하기도 한다. 유효전력은 혼동을 피하려고 항상 [W]를 쓴다`,
      },
      {
        id: "maximum-power-transfer",
        title: "최대 전력 전달",
        body: `부하에 최대 전력이 전달되는 조건과 그때의 최대 전력.

| 부하 | 최대 전력 전달 조건 | 부하 최대 전력 |
| --- | --- | --- |
| 저항 부하 | $r = R_L$ (내부 저항 = 부하 저항) | $P_{max} = \\frac{E^2}{4r}$ |
| 임피던스 부하 | $Z_g = Z_L^*$ (내부 임피던스 = 부하 임피던스의 켤레 복소수) | $P_{max} = \\frac{E^2}{4r}$ |

$$
P_{max} = I^2R_L = \\left(\\frac{E}{r + R_L}\\right)^2 R_L = \\left(\\frac{E}{2r}\\right)^2 r = \\frac{E^2}{4r}\\ [\\mathrm{W}]
$$

- 임피던스 부하도 $Z_g + Z_L^*$의 허수부가 상쇄되어 같은 결과 → 두 경우 최대 전력 값은 같다`,
      },
    ],
  },
  {
    id: "network-analysis",
    title: "회로망 해석법",
    cards: [
      {
        id: "source-transformation",
        title: "전원의 등가 변환",
        body: `전압원(직렬 $R$)과 전류원(병렬 $R$)은 서로 등가 변환할 수 있다.

- 전압원 → 전류원: $I = \\frac{V}{R}$
- 전류원 → 전압원: $V = IR$

| 이상적인 전원 | 내부 저항 | 전원 제거 시 |
| --- | --- | --- |
| 전압원 | $0$ | **단락** |
| 전류원 | $\\infty$ | **개방** |`,
      },
      {
        id: "kcl-network",
        title: "KCL을 활용한 회로망 정리",
        body: `키르히호프 제1법칙(전류법칙, KCL): 임의의 접속점에서 들어오는 전류의 합 = 나가는 전류의 합.

$$
\\sum I_{\\text{나가는 전류}} = 0
$$

- 풀이 요령: 미지 전압 $V_a$인 접속점에서 **나가는 방향**으로 전류를 모두 적고 합을 0으로 둔다
  - 전류원이 들어오는 방향이면 나가는 전류는 음수(−)
  - 저항으로 나가는 전류 $= \\frac{V_a - (\\text{상대편 전위})}{R}$
- 구한 $V_a$로 각 가지 전류를 계산한다`,
      },
      {
        id: "superposition",
        title: "중첩의 정리",
        body: `여러 전원이 있는 회로망에서 원하는 구간의 전류(또는 지점의 전압)를 구할 때, 전원을 하나씩만 남기고 각각 구한 값을 더한다.

- 남기지 않는 전원은 제거: **전압원은 단락, 전류원은 개방**
- 각 전원만 있을 때의 전류 $I_1, I_2, \\dots$를 구해 합한다: $I = I_1 + I_2 + \\cdots$
- 예: 전압원 단락 시 전류 분배, 전류원 개방 시 $I = \\frac{V}{R}$ → 두 결과를 합산`,
      },
      {
        id: "millman-theorem",
        title: "밀만의 정리",
        body: `여러 전압원이 병렬로 연결되었을 때 전체(단자) 전압을 구하는 방법.

$$
V_{ab} = \\frac{I}{Y} = \\frac{E_1Y_1 + E_2Y_2 + \\cdots}{Y_1 + Y_2 + \\cdots} = \\frac{\\frac{E_1}{R_1} + \\frac{E_2}{R_2} + \\cdots}{\\frac{1}{R_1} + \\frac{1}{R_2} + \\cdots}
$$

- 분자: 각 전원 전압 × 그 가지의 어드미턴스의 합, 분모: 어드미턴스의 합`,
      },
      {
        id: "thevenin-theorem",
        title: "테브난의 정리",
        body: `복잡한 회로를 하나의 전압원 $V_{TH}$와 등가저항 $R_{TH}$의 직렬 회로로 바꾸는 정리. 부하전류 $I_L$을 쉽게 구하려고 쓴다.

**1) 등가 전압** $V_{TH}$ — a-b 단자를 개방하고 a-b에 걸리는 전압을 구한다 ($R_2$에 걸리는 전압과 같음)

$$
V_{TH} = \\frac{R_2}{R_1 + R_2} \\times V\\ [\\mathrm{V}]
$$

**2) 등가 저항** $R_{TH}$ — 전압원을 단락하고, a-b 단자에서 바라본 합성 임피던스

$$
R_{TH} = R_3 + \\frac{R_1R_2}{R_1 + R_2}\\ [\\Omega]
$$

**3) 부하전류** — $V_{TH}$, $R_{TH}$에 $R_L$을 직렬로 연결

$$
I_L = \\frac{V_{TH}}{R_{TH} + R_L}\\ [\\mathrm{A}]
$$

- 시험 유형: ① $V_{TH}$와 $R_{TH}$ 구하기 ② $I_L$ 구하기`,
      },
    ],
  },
  {
    id: "polyphase-ac",
    title: "다상 교류",
    cards: [
      {
        id: "symmetrical-three-phase",
        title: "대칭 3상 교류",
        body: `크기와 주파수가 같고 서로 위상차가 $120°$인 3개의 교류로 이루어진 전원.

- $v_a = \\sqrt{2}V\\sin\\omega t = V\\angle 0°$
- $v_b = \\sqrt{2}V\\sin\\left(\\omega t - \\frac{2}{3}\\pi\\right) = V\\angle -\\frac{2}{3}\\pi$
- $v_c = \\sqrt{2}V\\sin\\left(\\omega t - \\frac{4}{3}\\pi\\right) = V\\angle -\\frac{4}{3}\\pi$

**특징**
- 상의 순서: $a$상 → $b$상 → $c$상
- 각 상의 위상차: $120°$ $\\left(\\frac{2}{3}\\pi\\ [\\mathrm{rad}]\\right)$
- 대칭 3상 기전력의 벡터 합: $V_a + V_b + V_c = 0$`,
      },
      {
        id: "three-phase-connection",
        title: "3상 교류의 결선 방법",
        body: `| 결선 | 전압 관계 | 전류 관계 |
| --- | --- | --- |
| Y결선(성형·스타) | $V_l = \\sqrt{3}V_p\\angle\\frac{\\pi}{6}$ | $I_l = I_p$ |
| △결선(환형) | $V_l = V_p$ | $I_l = \\sqrt{3}I_p\\angle -\\frac{\\pi}{6}$ |

**$n$상 결선**
- 성형: $V_l = 2\\sin\\frac{\\pi}{n}V_p\\angle\\frac{\\pi}{2}\\left(1 - \\frac{2}{n}\\right)$, $I_l = I_p$
- 환형: $I_l = 2\\sin\\frac{\\pi}{n}I_p\\angle -\\frac{\\pi}{2}\\left(1 - \\frac{2}{n}\\right)$, $V_l = V_p$
- 단골: 선간전압과 상전압의 크기가 같은 것 → **6상**($V_l = V_p$), 위상차 $54°$ → **5상**
- 암기: $2\\sin\\frac{\\pi}{n}$ → "이 싸이판"

**3상 전력**
- 피상전력 $P_a = 3V_pI_p = \\sqrt{3}V_lI_l$ [VA]
- 유효전력 $P = 3V_pI_p\\cos\\theta = \\sqrt{3}V_lI_l\\cos\\theta$ [W]
- 무효전력 $P_r = 3V_pI_p\\sin\\theta = \\sqrt{3}V_lI_l\\sin\\theta$ [Var]`,
      },
      {
        id: "y-delta-transformation",
        title: "Y-△ 등가 변환",
        body: `**Y → △**

$$
Z_{ab} = \\frac{Z_aZ_b + Z_bZ_c + Z_cZ_a}{Z_c},\\quad Z_{bc} = \\frac{Z_aZ_b + Z_bZ_c + Z_cZ_a}{Z_a},\\quad Z_{ca} = \\frac{Z_aZ_b + Z_bZ_c + Z_cZ_a}{Z_b}
$$

- 임피던스 평형 시: $Z_\\triangle = 3Z_Y$

**△ → Y**

$$
Z_a = \\frac{Z_{ca}Z_{ab}}{Z_{ab} + Z_{bc} + Z_{ca}},\\quad Z_b = \\frac{Z_{ab}Z_{bc}}{Z_{ab} + Z_{bc} + Z_{ca}},\\quad Z_c = \\frac{Z_{bc}Z_{ca}}{Z_{ab} + Z_{bc} + Z_{ca}}
$$

- 임피던스 평형 시: $Z_Y = \\frac{1}{3}Z_\\triangle$`,
      },
      {
        id: "two-wattmeter-method",
        title: "2전력계법",
        body: `전력계 2개($W_1$, $W_2$)로 3상 전력을 측정하는 방법.

- 유효전력: $P = W_1 + W_2$ [W]
- 무효전력: $P_r = \\sqrt{3}(W_1 - W_2)$ [Var]
- 피상전력: $P_a = \\sqrt{P^2 + P_r^2} = 2\\sqrt{W_1^2 + W_2^2 - W_1W_2}$ [VA]
- 역률:

$$
\\cos\\theta = \\frac{P}{P_a} = \\frac{W_1 + W_2}{2\\sqrt{W_1^2 + W_2^2 - W_1W_2}}
$$

- 순저항 부하(역률 1)일 때만 두 전력계의 지시값이 같다`,
      },
      {
        id: "v-connection",
        title: "V결선",
        body: `3상 변압기 중 1대가 고장·점검 중일 때 나머지 2대로 임시 운전하는 결선 방식.

- V결선 출력: $P_v = \\sqrt{3}P_1$ [W] ($P_1$: 변압기 1대 용량)
- 출력비 $= \\frac{V\\text{결선 출력}}{\\triangle\\text{결선 출력}} = \\frac{\\sqrt{3}P_1}{3P_1} = \\frac{\\sqrt{3}}{3} = 0.577$ → **57.7[%]**
- 이용률 $= \\frac{V\\text{결선 출력}}{\\text{변압기 2대 출력}} = \\frac{\\sqrt{3}P_1}{2P_1} = \\frac{\\sqrt{3}}{2} = 0.866$ → **86.6[%]**
- 출력비: 고장 전(3대) 총 출력 대비 V결선 출력 / 이용률: 남은 2대 정격 출력 합 대비 V결선 출력`,
      },
    ],
  },
  {
    id: "symmetrical-components-analysis",
    title: "대칭 좌표법 해석",
    cards: [
      {
        id: "symmetrical-components",
        title: "대칭 좌표법",
        body: `**벡터 연산자 $a$** — 크기 1, 위상각 $120°$인 연산자로 3상의 위상 변환에 쓴다.

- $a = 1\\angle 120° = -\\frac{1}{2} + j\\frac{\\sqrt{3}}{2}$
- $a^2 = 1\\angle 240° = -\\frac{1}{2} - j\\frac{\\sqrt{3}}{2}$
- $a^3 = 1\\angle 360° = 1\\angle 0°$
- $1 + a + a^2 = 0$

| 구분 | 표기 | 크기 | 위상차 | 상회전 방향 |
| --- | --- | --- | --- | --- |
| 정상분(1) | $V_1, I_1, Z_1$ | 동일 | $120°$ | 시계 방향(정방향) |
| 역상분(2) | $V_2, I_2, Z_2$ | 동일 | $120°$ | 반시계 방향(역방향) |
| 영상분(0) | $V_0, I_0, Z_0$ | 동일 | $0°$(영상) | 없음 |

**비대칭 전압의 분해**
- $V_a = V_0 + V_1 + V_2$, $V_b = V_0 + a^2V_1 + aV_2$, $V_c = V_0 + aV_1 + a^2V_2$
- $V_0 = \\frac{1}{3}(V_a + V_b + V_c)$, $V_1 = \\frac{1}{3}(V_a + aV_b + a^2V_c)$, $V_2 = \\frac{1}{3}(V_a + a^2V_b + aV_c)$
- 평형 3상에는 영상분 $V_0$와 역상분 $V_2$가 없다

**불평형률** $= \\frac{\\text{역상분}}{\\text{정상분}} \\times 100$ [%] — 암기: "**불평**이 생기더라도 **역전(정)**하면 된다"

**3상 교류발전기의 기본식**
- 영상분 $V_0 = -I_0Z_0$, 정상분 $V_1 = E_1 - I_1Z_1 = E_a - I_1Z_1$, 역상분 $V_2 = -I_2Z_2$
- 문제에서 정상분을 물으면 첨자가 1인 식, 영상분은 0, 역상분은 2인 식을 고른다`,
      },
    ],
  },
  {
    id: "nonsinusoidal-ac",
    title: "비정현파 교류",
    cards: [
      {
        id: "nonsinusoidal-wave",
        title: "비정현파(왜형파)",
        body: `정현파가 아닌 파형의 교류. 직류분 + 기본파 + 고조파의 합(또는 직류분 + cos항 + sin항의 합)으로 해석한다.

**푸리에 급수** — 비정현파를 삼각함수로 표현

$$
f(t) = a_0 + \\sum_{n=1}^{\\infty} a_n\\cos n\\omega t + \\sum_{n=1}^{\\infty} b_n\\sin n\\omega t
$$

| 직류분 | 기본파 | 고조파 |
| --- | --- | --- |
| $a_0$ | $a_1\\cos\\omega t$, $b_1\\sin\\omega t$ | $a_2\\cos 2\\omega t + \\cdots + a_n\\cos n\\omega t$, $b_2\\sin 2\\omega t + \\cdots + b_n\\sin n\\omega t$ |

- cos항 = 여현항, sin항 = 정현항`,
      },
      {
        id: "nonsinusoidal-symmetry",
        title: "비정현파의 대칭성",
        body: `| 대칭 종류 | 수식 | 직류분 | cos항 | sin항 |
| --- | --- | --- | --- | --- |
| 정현 대칭 → 원점 대칭(기함수) | $f(t) = -f(-t)$ | X | X | O |
| 여현 대칭 → $y$축 대칭(우함수) | $f(t) = f(-t)$ | O | O | X |
| 반파 대칭 → 반주기마다 $x$축 대칭 | $f(t) = -f\\left(t + \\frac{T}{2}\\right)$ | X | O (홀수만) | O (홀수만) |`,
      },
      {
        id: "nonsinusoidal-power",
        title: "비정현파의 전력 해석",
        body: `**실횻값** — 각 성분 실횻값의 제곱합의 제곱근

$$
V = \\sqrt{V_0^2 + \\left(\\frac{V_{m1}}{\\sqrt{2}}\\right)^2 + \\left(\\frac{V_{m2}}{\\sqrt{2}}\\right)^2 + \\left(\\frac{V_{m3}}{\\sqrt{2}}\\right)^2 + \\cdots}\\ [\\mathrm{V}]
$$

- 전류도 같은 방식: $I = \\sqrt{I_0^2 + \\left(\\frac{I_{m1}}{\\sqrt{2}}\\right)^2 + \\left(\\frac{I_{m2}}{\\sqrt{2}}\\right)^2 + \\cdots}$ [A]

**왜형률** $= \\frac{\\text{고조파의 실효치}}{\\text{기본파의 실효치}}$ — 암기: "**외(왜)**할머니가 **고기**를 주셨다"

**$n$고조파 임피던스**
- $RL$ 직렬: $Z_n = R + jn\\omega L = \\sqrt{R^2 + (n\\omega L)^2}$ [Ω]
- $RC$ 직렬: $Z_n = R - j\\frac{1}{n\\omega C} = \\sqrt{R^2 + \\left(\\frac{1}{n\\omega C}\\right)^2}$ [Ω]
- 고조파마다 임피던스가 달라지므로 소비전력은 차수별로 $P_n = I_n^2R$을 구해 합한다

**전력**
- 유효전력: $P = V_0I_0 + V_1I_1\\cos\\theta_1 + V_2I_2\\cos\\theta_2 + \\cdots = I_1^2R + I_2^2R + \\cdots$ [W] (같은 차수끼리만)
- 피상전력: $P_a = V_{\\text{실효값}} \\times I_{\\text{실효값}}$ [VA]
- 역률: $\\cos\\theta = \\frac{P}{P_a} = \\frac{P}{VI}$
- cos 성분은 $\\cos\\theta = \\sin(\\theta + 90°)$로 sin으로 바꿔 위상차를 맞춘다`,
      },
    ],
  },
  {
    id: "terminal-networks",
    title: "단자망",
    cards: [
      {
        id: "two-terminal-network",
        title: "2단자망 회로",
        body: `**구동점 임피던스** — 2단자망 단자에서 본 입력 임피던스 ($s = j\\omega$)

| 저항 $R$ | 인덕턴스 $L$ | 커패시턴스 $C$ |
| --- | --- | --- |
| $Z_R(s) = R$ | $Z_L(s) = j\\omega L = sL$ | $Z_C(s) = \\frac{1}{j\\omega C} = \\frac{1}{sC}$ |

- $Z = R + sL + \\frac{1}{sC}$ 꼴 → $RLC$ **직렬** 회로
- $Z = \\frac{1}{\\frac{1}{R} + \\frac{1}{sL} + sC}$ 꼴 → $RLC$ **병렬** 회로

**극점과 영점**
- 극점: $Z(s)$의 **분모**가 0이 되는 $s$ → 개방 상태
- 영점: $Z(s)$의 **분자**가 0이 되는 $s$ → 단락 상태

**역회로** — $K^2 = \\frac{L_1}{C_2} = \\frac{L_2}{C_1}$이면 두 회로는 $K$에 대해 역회로 (직렬 $L_1C_1$ ↔ 병렬 $L_2C_2$)
- 빠른 풀이: 한 회로의 $L \\times C$ = 다른 회로의 $L \\times C$

**정저항 회로** — 주파수와 관계없이 입력 임피던스의 허수부가 0, 실수부가 일정해 순저항처럼 보이는 회로

$$
R = \\sqrt{\\frac{L}{C}}\\ [\\Omega]
$$

- 주로 $R, L, C$ 중 두 값을 주고 나머지 하나를 구하는 문제로 나온다`,
      },
      {
        id: "four-terminal-network",
        title: "4단자망 회로",
        body: `단자가 4개(입력 2, 출력 2)인 회로망.

**기본방정식 (4단자 정수 $ABCD$)**

$$
\\begin{bmatrix} V_1 \\\\ I_1 \\end{bmatrix} = \\begin{bmatrix} A & B \\\\ C & D \\end{bmatrix}\\begin{bmatrix} V_2 \\\\ I_2 \\end{bmatrix},\\quad V_1 = AV_2 + BI_2,\\ I_1 = CV_2 + DI_2
$$

| 조건 | 정수 | 의미 |
| --- | --- | --- |
| 개방($I_2 = 0$) | $A = \\frac{V_1}{V_2}$ | 전압이득 |
| 개방($I_2 = 0$) | $C = \\frac{I_1}{V_2}$ | 어드미턴스 |
| 단락($V_2 = 0$) | $B = \\frac{V_1}{I_2}$ | 임피던스 |
| 단락($V_2 = 0$) | $D = \\frac{I_1}{I_2}$ | 전류이득 |

- $AD - BC = 1$, 대칭(좌우 대칭) 4단자망이면 $A = D$

**일반적인 4단자 회로의 정수**
- 직렬 임피던스 $Z$: $\\begin{bmatrix} 1 & Z \\\\ 0 & 1 \\end{bmatrix}$, 병렬 어드미턴스 $Y$: $\\begin{bmatrix} 1 & 0 \\\\ Y & 1 \\end{bmatrix}$
- $T$형: $\\begin{bmatrix} 1 + \\frac{Z_1}{Z_3} & \\frac{Z_1Z_2 + Z_2Z_3 + Z_3Z_1}{Z_3} \\\\ \\frac{1}{Z_3} & 1 + \\frac{Z_2}{Z_3} \\end{bmatrix}$
- $\\pi$형: $\\begin{bmatrix} 1 + \\frac{Z_2}{Z_3} & Z_2 \\\\ \\frac{Z_1 + Z_2 + Z_3}{Z_1Z_3} & 1 + \\frac{Z_2}{Z_1} \\end{bmatrix}$`,
      },
      {
        id: "network-parameters",
        title: "파라미터",
        body: `**$Z$·$Y$ 파라미터**
- $Z$ 파라미터($T$형 회로 해석): $V_1 = Z_{11}I_1 + Z_{12}I_2$, $V_2 = Z_{21}I_1 + Z_{22}I_2$
- $Y$ 파라미터($\\pi$형 회로 해석): $I_1 = Y_{11}V_1 + Y_{12}V_2$, $I_2 = Y_{21}V_1 + Y_{22}V_2$
- $T$형: $\\begin{bmatrix} Z_{11} & Z_{12} \\\\ Z_{21} & Z_{22} \\end{bmatrix} = \\begin{bmatrix} Z_1 + Z_3 & Z_3 \\\\ Z_3 & Z_2 + Z_3 \\end{bmatrix}$
- $\\pi$형: $\\begin{bmatrix} Y_{11} & Y_{12} \\\\ Y_{21} & Y_{22} \\end{bmatrix} = \\begin{bmatrix} Y_1 + Y_2 & -Y_2 \\\\ -Y_2 & Y_2 + Y_3 \\end{bmatrix}$

**영상 임피던스**
- $Z_{01} = \\sqrt{\\frac{AB}{CD}}$, $Z_{02} = \\sqrt{\\frac{BD}{AC}}$
- $Z_{01} \\times Z_{02} = \\frac{B}{C}$, $\\frac{Z_{01}}{Z_{02}} = \\frac{A}{D}$
- 대칭 회로($A = D$): $Z_{01} = Z_{02} = \\sqrt{\\frac{B}{C}}$

**$H$ 파라미터(하이브리드)**
- $V_1 = H_{11}I_1 + H_{12}V_2$, $I_2 = H_{21}I_1 + H_{22}V_2$
- $H_{11} = \\frac{V_1}{I_1}\\Big|_{V_2 = 0}$ → 출력측을 단락하고 입력에서 본 **입력 임피던스**`,
      },
    ],
  },
  {
    id: "distributed-parameter-circuit",
    title: "분포 정수 회로",
    cards: [
      {
        id: "distributed-line-characteristics",
        title: "분포 정수 회로와 선로 특성",
        body: `$R, L, G, C$가 선로를 따라 연속적으로 분포된 회로.

- 직렬 임피던스 $Z = R + j\\omega L$ [Ω/m], 병렬 어드미턴스 $Y = G + j\\omega C$ [℧/m]
- 특성(파동·고유) 임피던스: $Z_0 = \\sqrt{\\frac{Z}{Y}} = \\sqrt{\\frac{R + j\\omega L}{G + j\\omega C}}$ [Ω]
- 전파 정수: $\\gamma = \\sqrt{ZY} = \\alpha + j\\beta$ ($\\alpha$: 감쇠 정수, $\\beta$: 위상 정수)

| 구분 | 무손실 선로 ($R = G = 0$) | 무왜형 선로 ($LG = RC$) |
| --- | --- | --- |
| 특성 임피던스 | $Z_0 = \\sqrt{\\frac{L}{C}}$ | $Z_0 = \\sqrt{\\frac{L}{C}}$ |
| 감쇠 정수 | $\\alpha = 0$ | $\\alpha = \\sqrt{RG}$ |
| 위상 정수 | $\\beta = \\omega\\sqrt{LC}$ | $\\beta = \\omega\\sqrt{LC}$ |

- 파장: $\\lambda = \\frac{2\\pi}{\\beta}$ [m]
- 속도: $v = \\frac{\\omega}{\\beta} = \\frac{1}{\\sqrt{LC}}$ [m/s]
- 암기: "LG 리모컨($LG = RC$) 알쥐? ($\\alpha = \\sqrt{RG}$)"

**반사 계수** — 선로의 입사파와 반사파의 비

$$
\\rho = \\frac{Z_2 - Z_1}{Z_2 + Z_1}
$$`,
      },
    ],
  },
  {
    id: "transient-phenomena",
    title: "과도현상",
    cards: [
      {
        id: "transient-phenomena",
        title: "과도현상",
        body: `정상상태에 이르기 전까지 전압·전류가 일시적으로 변하는 과정. $L$과 $C$ 때문에 생기며, 전기기사에서는 주로 직류회로의 과도현상을 다룬다.

- **시정수 $\\tau$**: 최종값의 63.2[%]에 도달하는 데 걸리는 시간
- 시정수가 크면 과도현상이 오래 가고, 작으면 빨리 사라진다
- 단골 오답: "변화량의 0.632[%]가 변하는 데 걸리는 시간"
- 인덕터 $L$: 처음엔 개방($X_L = \\infty$) → 나중엔 단락($X_L = 0$)
- 커패시터 $C$: 처음엔 단락($X_C = 0$) → 나중엔 개방($X_C = \\infty$)

**"시끝시끝" 공식** (1계 선형 미분 방정식의 해에서 유도)

$$
H(t) = (\\text{시작} - \\text{끝})\\, e^{-\\frac{1}{\\text{시정수}} t} + \\text{끝}
$$`,
      },
      {
        id: "series-rl-rc-circuit",
        title: "직렬 회로",
        body: `기전력을 인가하거나 제거할 때 $RL$·$RC$ 직렬 회로의 전류 변화.

| 회로 | 인가 시 $i(t)$ | 제거 시 $i(t)$ | 시정수 $\\tau$ | 특성근 |
| --- | --- | --- | --- | --- |
| $RL$ | $\\frac{E}{R}\\left(1 - e^{-\\frac{R}{L}t}\\right)$ [A] | $\\frac{E}{R} e^{-\\frac{R}{L}t}$ [A] | $\\frac{L}{R}$ | $-\\frac{R}{L}$ |
| $RC$ | $\\frac{E}{R} e^{-\\frac{1}{RC}t}$ [A] | $-\\frac{E}{R} e^{-\\frac{1}{RC}t}$ [A] | $RC$ | $-\\frac{1}{RC}$ |

**회로의 제동 특성**

| 과제동(비진동) | 임계 제동(임계 진동) | 부족 제동(감쇠 진동) |
| --- | --- | --- |
| $R > 2\\sqrt{\\frac{L}{C}}$ | $R = 2\\sqrt{\\frac{L}{C}}$ | $R < 2\\sqrt{\\frac{L}{C}}$ |`,
      },
    ],
  },
  {
    id: "laplace",
    title: "라플라스",
    cards: [
      {
        id: "laplace-transform",
        title: "라플라스 변환",
        body: `해석을 쉽게 하려고 시간 영역 함수 $f(t)$를 복소수 영역 함수 $F(s)$로 바꾸는 변환.

$$
\\mathcal{L}[f(t)] = F(s) = \\int_0^\\infty f(t) e^{-st} dt
$$

| 함수 | $f(t)$ | $F(s)$ |
| --- | --- | --- |
| 단위 임펄스 | $\\delta(t)$ | $1$ |
| 단위 계단 | $u(t)$ | $\\frac{1}{s}$ |
| 시간 | $t^n$ | $\\frac{n!}{s^{n+1}}$ |
| 지수 | $e^{-at}$ | $\\frac{1}{s+a}$ |
| 지수 | $e^{at}$ | $\\frac{1}{s-a}$ |
| 사인 | $\\sin\\omega t$ | $\\frac{\\omega}{s^2+\\omega^2}$ |
| 코사인 | $\\cos\\omega t$ | $\\frac{s}{s^2+\\omega^2}$ |

- 예: $\\mathcal{L}[\\cos 2t] = \\frac{s}{s^2+2^2}$ ($\\omega = 2$)`,
      },
      {
        id: "complex-shift-theorem",
        title: "복소 추이 정리",
        body: `시간 함수에 지수 함수가 곱해진 경우의 라플라스 변환.

$$
\\mathcal{L}[f(t) e^{\\pm at}] = F(s \\mp a)
$$

1. $f(t)$를 $F(s)$로 변환한다
2. $s$ 자리에 $s \\mp a$를 넣는다

- 예: $f(t) = te^{-2t}$ → $t$는 $\\frac{1}{s^2}$, $s$에 $s+2$ 대입 → $F(s) = \\frac{1}{(s+2)^2}$`,
      },
      {
        id: "real-differentiation-integration",
        title: "실미분과 실적분 정리",
        body: `시간 함수를 $t$에 대해 미분·적분한 경우의 라플라스 변환 (초깃값 $f(0) = 0$).

$$
\\mathcal{L}\\left[\\frac{d^n}{dt^n} f(t)\\right] = s^n F(s)
\\qquad
\\mathcal{L}\\left[\\int f(t)\\,dt\\right] = \\frac{1}{s} F(s)
$$

- 미분 $\\frac{d^n}{dt^n}$ → $s^n$, 적분 $\\int dt$ → $\\frac{1}{s}$로 바꾸고 $f(t)$를 $F(s)$로 변환
- 예: $\\frac{d}{dt}y(t) + y(t)$ → $sY(s) + Y(s)$
- 예: $\\frac{1}{C}\\int i(t)\\,dt$ → $\\frac{1}{Cs} I(s)$`,
      },
      {
        id: "time-shift-theorem",
        title: "시간 추이 정리",
        body: `시간 영역에서 $a$만큼 이동(지연)한 함수의 라플라스 변환.

$$
\\mathcal{L}[f(t-a)] = F(s) e^{-as}
$$

1. $f(t)$를 라플라스 변환한다
2. $e^{-as}$를 곱한다

- 예: 1~2초 구간만 1인 구형파 $f(t) = u(t-1) - u(t-2)$
  - $F(s) = \\frac{1}{s}e^{-s} - \\frac{1}{s}e^{-2s} = \\frac{1}{s}(e^{-s} - e^{-2s})$`,
      },
      {
        id: "initial-final-value-theorem",
        title: "초깃값과 최종값 정리",
        body: `$F(s)$만으로 시간 함수의 처음 값과 마지막 값을 구한다.

| 초깃값 정리 | 최종값 정리 |
| --- | --- |
| $f(0) = \\lim_{t \\to 0} f(t) = \\lim_{s \\to \\infty} sF(s)$ | $f(\\infty) = \\lim_{t \\to \\infty} f(t) = \\lim_{s \\to 0} sF(s)$ |

- 초깃값은 $s \\to \\infty$, 최종값은 $s \\to 0$ — 방향이 서로 반대인 것에 주의`,
      },
      {
        id: "inverse-laplace-transform",
        title: "라플라스 역변환",
        body: `복소수 영역 함수 $F(s)$를 시간 영역 함수 $f(t)$로 되돌리는 변환: $\\mathcal{L}^{-1}[F(s)] = f(t)$

**완전 제곱식 활용** (예: $F(s) = \\frac{3s+5}{s^2+2s+5}$)

1. 분모를 완전제곱식으로: $s^2+2s+5 = (s+1)^2+2^2$
2. 분자를 $s+1$ 형태로: $3s+5 = 3(s+1)+2$
3. cos·sin 형태로 분리: $3 \\times \\frac{s+1}{(s+1)^2+2^2} + \\frac{2}{(s+1)^2+2^2}$
4. 역변환: $f(t) = 3e^{-t}\\cos 2t + e^{-t}\\sin 2t = e^{-t}(3\\cos 2t + \\sin 2t)$

**헤비사이드 부분분수 전개법** (예: $I(s) = \\frac{2s+3}{(s+1)(s+2)}$)

1. 두 항으로 나눈다: $\\frac{A}{s+1} + \\frac{B}{s+2}$
2. $A = \\frac{2s+3}{s+2}\\Big|_{s=-1} = 1$, $B = \\frac{2s+3}{s+1}\\Big|_{s=-2} = 1$
3. 역변환: $e^{-t} + e^{-2t}$

- 부분분수 전개는 풀이 순서를 패턴으로 익혀 두면 좋다`,
      },
    ],
  },
  {
    id: "transfer-function",
    title: "전달함수",
    cards: [
      {
        id: "transfer-function",
        title: "전달함수",
        body: `초기조건을 0으로 두고, 출력의 라플라스 변환 $C(s)$를 입력의 라플라스 변환 $R(s)$로 나눈 값.

$$
G(s) = \\frac{C(s)}{R(s)}
$$

- 블록선도: 입력 $R(s)$ → $G(s)$(전달함수) → 출력 $C(s)$`,
      },
      {
        id: "rlc-transfer-function",
        title: "RLC 회로 전달함수의 라플라스 변환",
        body: `$R$, $L$, $C$ 소자의 전압 식을 라플라스 변환해 $s$ 영역 임피던스로 다룬다.

| 소자 | $v(t)$ | $V(s)$ |
| --- | --- | --- |
| $R$ | $Ri(t)$ | $RI(s)$ |
| $L$ | $L\\frac{d}{dt}i(t)$ | $LsI(s)$ |
| $C$ | $\\frac{1}{C}\\int i(t)\\,dt$ | $\\frac{1}{Cs}I(s)$ |

- 회로 문제는 $R$, $X_L = sL$, $X_C = \\frac{1}{sC}$로 바꿔 전압 분배 법칙을 적용한다
- 예: $L$–$C$–$R$ 직렬에서 $R$ 양단을 출력으로 하면

$$
G(s) = \\frac{V_2(s)}{V_1(s)} = \\frac{R}{sL + \\frac{1}{sC} + R} = \\frac{sCR}{s^2LC + sCR + 1}
$$`,
      },
    ],
  },
  {
    id: "control-system-structure",
    title: "제어시스템의 구성",
    cards: [
      {
        id: "control-open-closed-loop",
        title: "개회로 제어계와 폐회로 제어계",
        body: `**개루프(개회로) 제어계**: 출력을 다시 확인하지 않고 정해진 입력만으로 동작한다. 간단하지만 오차가 커질 수 있다.

**폐루프(폐회로) 제어계 = 궤환(Feed back) 제어계**: 출력과 기준값을 비교해 생긴 차이에 비례하는 보정 신호를 되돌려 보내 수정한다.

- 피드백 제어계에는 입력과 출력을 **비교하는 장치가 반드시 필요**하다 (단골 정답)
- 구성: 목푯값 → 기준입력요소 → 제어요소(조절부+조작부) → 제어대상 → 제어량, 검출부로 궤환

| 용어 | 의미 |
| --- | --- |
| 동작 신호 | 기준 입력과 검출부(궤환량)의 차이 |
| 제어 요소 | 조절부와 조작부 |
| 조작량 | 제어 요소의 출력, 제어 대상에 전달되는 신호 |
| 제어량 | 제어 대상의 상태를 나타내는 값(최종 결과) |

| 폐회로 장점 | 폐회로 단점 |
| --- | --- |
| 목푯값에 안정적으로 도달, 대역폭 증가, 외란 영향 감소 | 구조가 복잡하고 비쌈, 국소 고장에 전체가 마비될 수 있음 |

- 단골 오답: (폐회로는) 구조가 간단하고 설비비가 저렴하다`,
      },
      {
        id: "control-system-classification",
        title: "제어계의 분류",
        body: `**1. 제어 동작(조절부)에 의한 분류**

| 제어 | 특징 | 식 |
| --- | --- | --- |
| 비례 $P$ | 잔류 편차 발생 | $Y(s) = KZ(s)$ |
| 적분 $I$ | 잔류 편차 제거 | $Y(s) = \\frac{1}{T_i s}Z(s)$ |
| 미분 $D$ | 잔류 편차 억제 | $Y(s) = T_d s Z(s)$ |
| 비례 적분 $PI$ | 잔류 편차 제거, 속응성 나쁨 | $Y(s) = KZ(s)\\left(1 + \\frac{1}{T_i s}\\right)$ |
| 비례 미분 $PD$ | 잔류 편차 존재, 속응성 좋음 | $Y(s) = KZ(s)(1 + T_d s)$ |
| 비례 적분 미분 $PID$ | 잔류 편차 제거, 속응성 좋음 | $Y(s) = KZ(s)\\left(1 + T_d s + \\frac{1}{T_i s}\\right)$ |

**2. 제어량에 의한 분류**

| 프로세스 제어 | 자동 조정 기구 | 서보 기구 제어 |
| --- | --- | --- |
| 생산 공정 상태: 압력, 유량, 농도, 온도 | 전기·기계적 양: 주파수, 전압, 속도 | 기계적 변위: 자세, 방위, 거리, 위치 |

- 암기: '**세스**'코는 '**자동**'으로 벌레를 잡아요. '**서보**'세요.

**3. 목푯값에 의한 분류**

- 정치 제어: 목푯값이 시간과 관계없이 일정
- 추치 제어: 변하는 목푯값을 따라감
  - 추종 제어(서보기구에 주로 사용): 추적용 레이더, 대공 유도탄
  - 프로그램 제어(미리 정한 순서): 무인 열차, 무인 엘리베이터
  - 비율 제어(비율 일정 유지): 보일러
- 암기: '**추**'어탕의 미꾸라지 '**그램**' '**비율**'`,
      },
    ],
  },
  {
    id: "control-block-and-signal-flow",
    title: "블록선도와 신호흐름선도",
    cards: [
      {
        id: "control-block-diagram",
        title: "블록선도",
        body: `신호의 흐름을 화살표·블록·가합점·분기점으로 나타낸 그림.

- 4대 요소: 화살표(신호 방향), 블록(입력 $R$이 전달함수 $G$를 거쳐 출력 $C$), 가합점(신호의 덧셈·뺄셈), 분기점(신호를 여러 방향으로 나눔)

| 연결 | 전달함수 $\\frac{C}{R}$ |
| --- | --- |
| 직렬(곱셈) | $G_1 G_2$ |
| 병렬(덧셈) | $G_1 + G_2$ |
| 궤환(피드백) | $\\frac{G}{1-(-GH)} = \\frac{G}{1+GH}$ |

$$
\\frac{C}{R} = \\frac{\\text{전향 전달함수}}{1 - \\text{개루프 전달함수}}
$$

- 전향 전달함수 $G$, 개루프 전달함수 $GH$
- $H = 1$이면 블록 없이 경로만 있는 **단위 피드백 제어계**
- $H$의 부호에 따라 정궤환(+)·부궤환(−)이 있으며, 보통 부궤환(−)으로 해석한다`,
      },
      {
        id: "control-signal-flow-graph",
        title: "신호흐름선도",
        body: `블록선도를 마디와 가지(이득)로 나타낸 그림. 전달함수는 **메이슨의 정리**로 구한다.

$$
\\frac{C(s)}{R(s)} = \\frac{\\sum G\\Delta}{1 - \\left(\\sum L_1\\right) + \\left(\\sum L_2\\right) - \\left(\\sum L_3\\right)}
$$

- $\\sum G\\Delta$: 전향경로 × (1 − 그 전향경로와 닿지 않는 루프)의 합
- $\\sum L_1$: 모든 루프 이득의 합 (접촉 여부 무관)
- $\\sum L_2$: 서로 접촉하지 않는 두 루프 이득의 곱
- $\\sum L_3$: 서로 접촉하지 않는 세 루프 이득의 곱
- 값을 대입할 때 **부호 변화와 괄호 묶기**에 주의

- 예: 전향 경로 $abcdef$, $ajdef$, 루프 $cdh$, $dek$, $i$ (접촉 X인 쌍: $cdh$·$i$)

$$
\\frac{C}{R} = \\frac{abcdef + ajdef}{1 - (cdh + dek + i) + cdhi}
$$`,
      },
    ],
  },
  {
    id: "control-response",
    title: "제어계의 응답",
    cards: [
      {
        id: "control-characteristic-equation",
        title: "특성방정식",
        body: `피드백 제어계의 전달함수 분모를 0으로 둔 식.

$$
F(s) = 1 + G(s)H(s) = 0
$$

- 전체(폐루프) 전달함수가 주어지면: $F(s)$ = 분모 = 0
- **개루프** 전달함수가 주어지면: $F(s)$ = 분모 + 분자 = 0
- 특성근: 특성방정식을 0으로 만드는 $s$ 값
- 주어진 함수가 폐루프인지 개루프인지에 따라 구하는 법이 다르므로 주의
- 예: 개루프 $G(s) = \\frac{5}{s(s+3)(s+6)}$ → $F(s) = s^3 + 9s^2 + 18s + 5 = 0$`,
      },
      {
        id: "control-transient-response-types",
        title: "과도응답의 종류",
        body: `입력 $r(t)$에 따라 출력 $c(t)$가 정상상태에 이르기 전까지 나타나는 일시적인 응답: $c(t) = \\mathcal{L}^{-1}[R(s)G(s)]$

| 응답 | 입력 | $R(s)$ | 출력 $c(t)$ |
| --- | --- | --- | --- |
| 임펄스 응답 | $r(t) = \\delta(t)$ | $1$ | $\\mathcal{L}^{-1}[G(s)]$ |
| 인디셜(단위 계단) 응답 | $r(t) = u(t)$ | $\\frac{1}{s}$ | $\\mathcal{L}^{-1}\\left[\\frac{1}{s}G(s)\\right]$ |
| 램프 응답 | $r(t) = t$ | $\\frac{1}{s^2}$ | $\\mathcal{L}^{-1}\\left[\\frac{1}{s^2}G(s)\\right]$ |

**과도응답 곡선 용어**

- 감쇠비 = $\\frac{\\text{제2 오버슈트}}{\\text{최대 오버슈트}}$ (단골 정답)
- 오버슈트 = $\\frac{\\text{최대 오버슈트}}{\\text{최종 목푯값}} \\times 100$[%]
- 지연 시간: 최종값의 50[%]에 도달하는 시간
- 상승 시간: 최종값의 10~90[%] 구간 (단골 오답: 10[%]→100[%])
- 정정 시간: 최종값의 ±5[%] 안에 들어가 계속 유지되기까지의 시간
- 시험에는 주로 $r(t)$와 $c(t)$를 주고 전달함수를 묻거나, $r(t)$와 $G(s)$를 주고 $c(t)$를 묻는다`,
      },
      {
        id: "control-second-order-response",
        title: "2차 지연 제어계의 과도응답",
        body: `$$
\\frac{C(s)}{R(s)} = \\frac{\\omega_n^2}{s^2 + 2\\zeta\\omega_n s + \\omega_n^2}
$$

- 특성방정식 $F(s) = s^2 + 2\\zeta\\omega_n s + \\omega_n^2 = 0$
- 특성근 $s_{1,2} = -\\zeta\\omega_n \\pm j\\omega_d = -\\zeta\\omega_n \\pm j\\omega_n\\sqrt{1-\\zeta^2}$
- $\\zeta$: 감쇠비(제동비, $\\delta$로 쓰기도 함), $\\omega_n$: 고유 주파수, $\\omega_d = \\omega_n\\sqrt{1-\\zeta^2}$: 감쇠 진동 주파수

| 감쇠비 | 근의 형태 | 응답 |
| --- | --- | --- |
| $\\zeta > 1$ | 서로 다른 음의 실근 | 과제동, 비진동 |
| $\\zeta = 1$ | 음의 중근 | 임계제동, 임계진동 |
| $0 < \\zeta < 1$ | 공액 복소수근(실수부 음수) | 부족제동, 감쇠진동 |
| $\\zeta = 0$ | 허근 | 무제동 |
| $\\zeta < 0$ | 공액 복소수근(실수부 양수) | 발산 |`,
      },
      {
        id: "control-steady-state-error",
        title: "정상 편차",
        body: `**오차** (단위 부궤환, $H(s) = 1$)

$$
E(s) = \\frac{1}{1+G(s)H(s)}R(s) = \\frac{1}{1+G(s)}R(s)
$$

**정상 편차**: 오차에 최종값 정리를 적용한 값

$$
e_{ss} = \\lim_{t \\to \\infty} e(t) = \\lim_{s \\to 0} sE(s) = \\lim_{s \\to 0} s\\left[\\frac{1}{1+G(s)}R(s)\\right]
$$

| 입력 | 정상 편차 | 편차 상수 |
| --- | --- | --- |
| 인디셜 $u(t)$, $R(s) = \\frac{1}{s}$ | 위치 편차 $e_{ss} = \\frac{1}{1+K_p}$ | $K_p = \\lim_{s \\to 0} G(s)$ |
| 램프 $t$, $R(s) = \\frac{1}{s^2}$ | 속도 편차 $e_{ss} = \\frac{1}{K_v}$ | $K_v = \\lim_{s \\to 0} sG(s)$ |`,
      },
      {
        id: "control-frequency-response",
        title: "주파수 응답",
        body: `출력 진폭을 입력 진폭으로 나눈 진폭비(크기)와 위상차로 나타낸다. $s = j\\omega$를 넣어 $G(j\\omega)$로 쓴다.

$$
G(j\\omega) = a + jb = \\sqrt{a^2+b^2} \\angle \\tan^{-1}\\frac{b}{a}
$$

| $G(j\\omega)$ | 크기 $\\lvert G(j\\omega) \\rvert$ | 위상차 $\\theta$ |
| --- | --- | --- |
| $a+jb$ | $\\sqrt{a^2+b^2}$ | $\\tan^{-1}\\frac{b}{a}$ |
| $\\frac{1}{a+jb}$ | $\\frac{1}{\\sqrt{a^2+b^2}}$ | $-\\tan^{-1}\\frac{b}{a}$ |
| $\\frac{a+jb}{c+jd}$ | $\\frac{\\sqrt{a^2+b^2}}{\\sqrt{c^2+d^2}}$ | $\\tan^{-1}\\frac{b}{a} - \\tan^{-1}\\frac{d}{c}$ |
| $\\frac{jb}{c+jd}$ | $\\frac{b}{\\sqrt{c^2+d^2}}$ | $90° - \\tan^{-1}\\frac{d}{c}$ |

- 이득 $g = 20\\log_{10}\\lvert G(j\\omega) \\rvert$ [dB]
- 형(Type): 개루프 전달함수 $G(s)H(s)$에서 **원점에 있는 극점의 개수** $l$ ($l = 0, 1, 2, 3$ → 0형, 1형, 2형, 3형 제어계)
- 부동작 요소 $G(s) = e^{-sL}$ → $G(j\\omega) = e^{-j\\omega L}$, 궤적은 **원**`,
      },
      {
        id: "control-sensitivity",
        title: "감도",
        body: `전체 전달함수 $T$가 $K$의 변화에 영향을 받는 정도.

$$
S_K^T = \\frac{K}{T}\\frac{d}{dK}T
$$

- 분수 미분: $\\left(\\frac{f(x)}{g(x)}\\right)' = \\frac{f'(x)g(x) - f(x)g'(x)}{g(x)^2}$
- 예: $K$ 뒤에 $G$, $H$ 궤환이 있는 블록선도에서 $T = \\frac{KG}{1+GH}$이면

$$
S_K^T = \\frac{K}{\\frac{KG}{1+GH}} \\times \\frac{G}{1+GH} = 1
$$`,
      },
    ],
  },
  {
    id: "control-stability",
    title: "안정도",
    cards: [
      {
        id: "control-routh-stability",
        title: "루스 안정도 판별법",
        body: `특성방정식의 근이 복소평면 어디에 있는지로 안정도를 판별한다. 전체 전달함수 $\\frac{C(s)}{R(s)} = \\frac{G(s)}{1+G(s)H(s)}$ 일 때 특성방정식은

$$
F(s) = 1 + G(s)H(s) = 0
$$

| 근 $s$의 위치 | 판별 |
| --- | --- |
| 좌반 평면 | 안정 |
| 허수축 | 임계 |
| 우반 평면 | 불안정 |

- 안정하려면 특성방정식의 모든 계수가 **같은 부호**이고, 차수별로 계수가 **빠짐없이** 있어야 한다
- **루스 판별법**: 근을 직접 구하지 않고 루스표를 만들어 판별 — 제1열에 부호 변화가 없으면 안정, 있으면 불안정
- 제1열의 **부호 변화 횟수 = 우반 평면에 있는 특성근의 개수** (예: $s^4 + 2s^3 + s^2 + 4s + 2 = 0$ → 부호 2번 변화 → 불안정, 우반 평면 근 2개)
- **3차 간이 판별**: $As^3 + Bs^2 + Cs + D = 0$ 에서 안쪽 곱 $BC$와 바깥쪽 곱 $AD$를 비교 — $BC > AD$ 안정, $BC = AD$ 임계 안정, $BC < AD$ 불안정
- 개루프 전달함수가 주어지면 "분모 + 분자 = 0"이 특성방정식 (예: $G(s) = \\frac{K}{s(s^2+5s+4)}$ → $s^3 + 5s^2 + 4s + K = 0$, 안정 범위 $0 < K < 20$)`,
      },
      {
        id: "control-nyquist-stability",
        title: "나이퀴스트 안정도 판별법",
        body: `개루프 주파수 응답 $G(j\\omega)H(j\\omega)$의 궤적($\\omega$를 연속으로 변화)으로 안정도를 판별한다. 기준점은 $(-1, j0)$.

| 궤적이 수렴할 때 $(-1, j0)$이 | 판별 |
| --- | --- |
| 왼쪽에 있음 | 안정 |
| 궤적 위를 지남 | 임계 안정 |
| 오른쪽에 있음 | 불안정 |

**나이퀴스트 선도 그리기**: 분모의 $s^n$ 차수(형)로 출발 사분면, 괄호 개수로 통과하는 면의 수를 정한다.

| 분모 | 형 | 출발 |
| --- | --- | --- |
| $s^0$ | 0형 | 4사분면 |
| $s^1$ | 1형 | 3사분면 |
| $s^2$ | 2형 | 2사분면 |
| $s^3$ | 3형 | 1사분면 |

- 괄호 1개 → 면 1개 통과, 2개 → 2개, 3개 → 3개, 4개 → 4개

**이득 여유와 위상 여유**

- 이득 여유: 선도가 실수축과 만나는 점과 $(-1, j0)$ 사이의 거리상 여유 (허수부 $= 0$ 에서 계산), $g_m > 0$ 이면 안정

$$
g_m = 20\\log\\frac{1}{\\lvert G(j\\omega)H(j\\omega)\\rvert}\\ [\\mathrm{dB}]
$$

- 위상 여유: 선도가 단위 원(크기 1)과 만나는 점에서 $(-1, j0)$까지 남은 각도상 여유, $\\phi_m > 0$ 이면 안정
- 예: $G(j\\omega)H(j\\omega) = \\frac{K}{(1+j4\\omega)(1+j3\\omega)}$ 의 이득 여유가 40[dB] → $\\omega = 0$ 대입, $K = \\frac{1}{100}$`,
      },
      {
        id: "control-bode-stability",
        title: "보드 선도 안정도 판별법",
        body: `주파수 응답을 이용하는 방법으로 나이퀴스트 선도와 원리는 같지만, 크기와 위상을 **로그 축**에 그려 작성이 쉽고 이득 여유·위상 여유로 안정도를 판별한다.

- 이득 곡선이 0[dB]과 만날 때 위상 곡선이 $-180°$보다 크면 위상 여유가 있어 **안정**
- 위상 곡선이 $-180°$와 만날 때 이득 곡선이 0[dB]보다 작으면 이득 여유가 있어 **안정**

**절대 안정도와 상대 안정도**

| 구분 | 판단 내용 | 판별법 |
| --- | --- | --- |
| 절대 안정도 | 안정한지 여부만 | 루스 판별법 |
| 상대 안정도 | 얼마나 안정한지까지 (이득·위상 여유) | 나이퀴스트 선도, 보드 선도 |

**절점 주파수**: 이득 곡선의 기울기가 바뀌기 시작하는 주파수 — 전달함수의 실수 성분과 허수 성분의 크기가 같아지는 주파수`,
      },
    ],
  },
  {
    id: "control-root-locus",
    title: "근궤적법",
    cards: [
      {
        id: "control-root-locus-basics",
        title: "근궤적 작성 기초",
        body: `**근궤적**: 개루프 전달함수 $G(s)H(s)$의 이득 $K$를 $0 \\sim \\infty$로 키울 때 특성근이 복소평면에서 움직이는 자취.

| 항목 | 내용 | 암기 |
| --- | --- | --- |
| 출발점·도착점 | $K = 0$ 일 때 **극점**에서 출발, $K = \\infty$ 일 때 **영점**에서 도착 | 극출 영도 |
| 근궤적의 개수 | 극점과 영점의 개수 중 큰 값 | 특성방정식의 최고 차수와 일치 |
| 실수축 위 존재 범위 | 극점·영점을 실수축에 찍고 오른쪽부터 번호를 매겨, **홀수 번호에서 시작해 짝수 번호에서 끝나는** 구간 (무한대 구간은 짝수로 봄) | 오른쪽 홀짝 |

**점근선** ($P$: 극점 개수, $Z$: 영점 개수)

- 개수: $P - Z$
- 실수축과의 교차점

$$
\\delta = \\frac{\\text{극점의 총합} - \\text{영점의 총합}}{P - Z}
$$

- 각도: $\\theta = \\frac{\\pi(2k+1)}{P - Z}$ $(k = 0, 1, 2, 3, \\cdots)$, $k$의 개수 $= P - Z$ (예: $P - Z = 2$ 이면 $k = 0, 1$)`,
      },
      {
        id: "control-root-locus-advanced",
        title: "근궤적 작성 심화",
        body: `**분지점(이탈점, 분리점)**: 근궤적이 실수축을 벗어나 허수부로 갈라져 나가는 점.

$$
\\frac{d}{ds}K = 0
$$

- 풀이 순서: 특성방정식("분모 + 분자 = 0")을 $K = \\cdots$ 꼴로 정리 → $s$로 미분해 0으로 놓고 근을 구함 → 그중 **근궤적 존재 범위 안**에 있는 값이 분지점
- 예: $G(s)H(s) = \\frac{K}{s(s+4)(s+5)}$ → $K = -s^3 - 9s^2 - 20s$, $-3s^2 - 18s - 20 = 0$ → $s = -1.47$ 또는 $-4.53$ → 극점 $0, -4, -5$로 본 존재 범위에 드는 **$-1.47$**

**근궤적과 허수축의 교차**

- 근궤적이 좌반 평면에서 허수축을 지나 우반 평면으로 넘어가는 점 = 시스템이 안정 → 불안정으로 바뀌는 경계
- 이 조건은 루스표 제1열에 **0이 생길 때** 만족된다`,
      },
    ],
  },
  {
    id: "control-state-space-z-transform",
    title: "상태 공간법과 z 변환",
    cards: [
      {
        id: "control-state-equation",
        title: "상태 방정식",
        body: `시스템의 동작 특성을 미분 방정식과 **행렬**로 나타낸 식 (입력 변수 → 상태 변수 → 출력 변수).

$$
\\dot{x} = \\frac{d}{dt}x = Ax + Br
$$

- $A$ (시스템 행렬): 시스템의 고유 특성을 결정
- $B$ (입력 행렬): 입력이 상태에 주는 영향 정도

**시스템 행렬 $A$ 빨리 구하기** — 미분 방정식의 계수를 부호를 바꿔 마지막 행에 거꾸로 넣는다

- $K_1\\frac{d^2c(t)}{dt^2} + K_2\\frac{dc(t)}{dt} + K_3c(t) = r(t)$ 일 때 $A = \\begin{bmatrix} 0 & 1 \\\\ -K_3 & -K_2 \\end{bmatrix}$
- $K_1\\frac{d^3}{dt^3}c(t) + K_2\\frac{d^2}{dt^2}c(t) + K_3\\frac{d}{dt}c(t) + K_4c(t) = r(t)$ 일 때 $A = \\begin{bmatrix} 0 & 1 & 0 \\\\ 0 & 0 & 1 \\\\ -K_4 & -K_3 & -K_2 \\end{bmatrix}$
- 예: $\\frac{d^2c(t)}{dt^2} + 5\\frac{dc(t)}{dt} + 3c(t) = r(t)$ → $A = \\begin{bmatrix} 0 & 1 \\\\ -3 & -5 \\end{bmatrix}$ (상태 변수 $x_1 = c(t)$, $x_2 = \\dot{c}(t)$로 두고 유도해도 같음)`,
      },
      {
        id: "control-state-transition-matrix",
        title: "상태 천이 행렬",
        body: `시간이 흐름에 따라 시스템의 상태가 어떻게 변하는지 보여주는 시간 영역의 응답 행렬.

$$
\\phi(t) = \\mathcal{L}^{-1}\\left[(sI - A)^{-1}\\right] = e^{At}
$$

**성질**

- $\\phi(0) = I$
- $\\phi^{-1}(t) = \\phi(-t)$ (단골 오답: $\\phi^{-1}(t) = -\\phi(-t)$)
- $\\phi(t_2 - t_1) \\times \\phi(t_1 - t_0) = \\phi(t_2 - t_0)$
- $[\\phi(t)]^K = \\phi(Kt)$

**단위 행렬**: $I = \\begin{bmatrix} 1 & 0 \\\\ 0 & 1 \\end{bmatrix}$, $sI = \\begin{bmatrix} s & 0 \\\\ 0 & s \\end{bmatrix}$ (3×3도 대각선이 1, $s$)

**특성방정식** — 시스템 행렬 $A$로 안정성을 판별하는 방정식

$$
F(s) = \\lvert sI - A \\rvert = 0
$$

- 예: $A = \\begin{bmatrix} 0 & 1 \\\\ -3 & 4 \\end{bmatrix}$ → $sI - A = \\begin{bmatrix} s & -1 \\\\ 3 & s-4 \\end{bmatrix}$ → $s^2 - 4s + 3 = 0$, 특성근(고윳값) $s = 1, 3$
- 행렬식: $\\begin{vmatrix} a & b \\\\ c & d \\end{vmatrix} = ad - bc$
- 상태 천이 행렬 객관식 빠른 풀이: 원소 부호 패턴이 $(+\\ -\\ +\\ -)$ / $(-\\ +\\ -\\ +)$ 꼴인 보기를 찾고, 시스템 행렬의 ↙ 방향 원소가 지수에 들어간 것을 고른다`,
      },
      {
        id: "control-z-transform",
        title: "z 변환",
        body: `시간 영역의 연속 신호를 일정 간격으로 쪼갠 **이산 신호**를 복소수 영역으로 변환하는 도구.

| 함수 | $f(t)$ | $F(z)$ | $F(s)$ |
| --- | --- | --- | --- |
| 단위 계단 함수 | $u(t)$ | $\\frac{z}{z-1}$ | $\\frac{1}{s}$ |
| 임펄스 함수 | $\\delta(t)$ | $1$ | $1$ |
| 지수 함수 | $e^{-at}$ | $\\frac{z}{z - e^{-aT}}$ | $\\frac{1}{s+a}$ |

- 단골: $z$ 변환과 라플라스 변환이 같은 함수 → **임펄스 함수 $\\delta(t)$**
- $f(t)$의 $z$ 변환과 라플라스 변환을 함께 묻는 문제가 자주 나온다

**초깃값·최종값 정리**

- 초깃값: $f(0) = \\lim_{t \\to 0} f(t) = \\lim_{z \\to \\infty}(1 - z^{-1})F(z) = \\lim_{z \\to \\infty}F(z)$
- 최종값: $f(\\infty) = \\lim_{t \\to \\infty} f(t) = \\lim_{z \\to 1}(1 - z^{-1})F(z)$

**$z$ 평면의 안정 조건**

| 근의 위치 | 판별 |
| --- | --- |
| 단위원 **안** | 안정 |
| 단위원 경계 | 임계 안정 |
| 단위원 **밖** | 불안정 |`,
      },
    ],
  },
  {
    id: "control-logic-sequence",
    title: "논리 회로와 시퀀스 회로",
    cards: [
      {
        id: "control-logic-operations",
        title: "논리 연산",
        body: `**불대수**: ON/OFF 논리 상태의 관계를 수식으로 세워, 복잡한 논리 회로를 가장 단순한 형태로 줄이는 연산 규칙.

**기본 법칙**

| | |
| --- | --- |
| $A + 1 = 1$ | $A + 0 = A$ |
| $A + A = A$ | $A + \\overline{A} = 1$ |
| $A \\cdot 0 = 0$ | $A \\cdot 1 = A$ |
| $A \\cdot A = A$ | $A \\cdot \\overline{A} = 0$ |

**응용 정리**

- 결합법칙: $(A + B) + C = A + (B + C)$, $(A \\cdot B) \\cdot C = A \\cdot (B \\cdot C)$
- 분배법칙: $A \\cdot (B + C) = (A \\cdot B) + (A \\cdot C)$, $A + (B \\cdot C) = (A + B) \\cdot (A + C)$
- 드모르간의 정리: $\\overline{A + B} = \\overline{A} \\cdot \\overline{B}$, $\\overline{A \\cdot B} = \\overline{A} + \\overline{B}$

- 예 (논리 회로 출력): $Y = \\overline{(\\overline{ABC} + \\overline{DE})F} = ABCDE + \\overline{F}$ — 드모르간으로 정리`,
      },
      {
        id: "control-logic-circuit-representations",
        title: "논리 회로의 다양한 표현",
        body: `**논리식과 진리표**

| 회로 | 논리식 | $A,B = 00$ | $01$ | $10$ | $11$ |
| --- | --- | --- | --- | --- | --- |
| AND | $X = A \\cdot B$ | 0 | 0 | 0 | 1 |
| OR | $X = A + B$ | 0 | 1 | 1 | 1 |
| NAND | $X = \\overline{A \\cdot B}$ | 1 | 1 | 1 | 0 |
| NOR | $X = \\overline{A + B}$ | 1 | 0 | 0 | 0 |
| XOR | $X = A \\cdot \\overline{B} + \\overline{A} \\cdot B = A \\oplus B$ | 0 | 1 | 1 | 0 |

- NOT: $X = \\overline{A}$ ($A = 0 \\to 1$, $A = 1 \\to 0$)

**시퀀스 회로(유접점 회로)**

- AND: 접점 $A$, $B$를 **직렬** / OR: $A$, $B$를 **병렬**
- NOT: $\\overline{A}$ 접점 하나
- NAND: $\\overline{A}$, $\\overline{B}$를 병렬 / NOR: $\\overline{A}$, $\\overline{B}$를 직렬
- XOR: ($A$, $\\overline{B}$ 직렬)과 ($\\overline{A}$, $B$ 직렬)을 병렬

**전자 회로(다이오드·트랜지스터) 쉽게 구별하기**

| 회로 | 모양 |
| --- | --- |
| AND | 다이오드가 왼쪽 방향 |
| OR | 다이오드가 오른쪽 방향 |
| NOT | 트랜지스터가 있음 |
| NAND | 다이오드 왼쪽 방향 + 트랜지스터 |
| NOR | 다이오드 오른쪽 방향 + 트랜지스터 |`,
      },
    ],
  },
];
