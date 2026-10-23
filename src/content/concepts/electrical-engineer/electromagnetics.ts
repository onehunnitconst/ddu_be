import type { ConceptChapter } from "@/types/concept";

/** 전기자기학 — 시하끝하 전기기사 필기 전기자기학 필수개념 01~36 요약 */
export const ELECTROMAGNETICS_CHAPTERS: ConceptChapter[] = [
  {
    id: "vector",
    title: "벡터의 이해",
    cards: [
      {
        id: "vector-analysis",
        title: "벡터의 해석",
        body: `스칼라는 크기만, 벡터는 크기와 방향을 함께 가진 값이다.

$$
\\vec{A} = A_x i + A_y j + A_z k
$$

- 크기: $\\lvert \\vec{A} \\rvert = \\sqrt{A_x^2 + A_y^2 + A_z^2}$
- 단위 벡터(방향): $\\vec{a_0} = \\frac{\\vec{A}}{\\lvert \\vec{A} \\rvert}$ → $\\vec{A} = \\lvert \\vec{A} \\rvert \\times \\vec{a_0}$
- 좌표로 표현: $\\vec{A}$ = 종점 − 시점
- **내적**(결과는 스칼라): $\\vec{A} \\cdot \\vec{B} = \\lvert \\vec{A} \\rvert \\lvert \\vec{B} \\rvert \\cos\\theta = A_x B_x + A_y B_y + A_z B_z$
  - $i \\cdot i = j \\cdot j = k \\cdot k = 1$, $i \\cdot j = j \\cdot k = k \\cdot i = 0$
- **외적**(결과는 벡터, 방향은 오른손 법칙): $\\vec{A} \\times \\vec{B} = \\lvert \\vec{A} \\rvert \\lvert \\vec{B} \\rvert \\sin\\theta$
  - $i \\times i = j \\times j = k \\times k = 0$
  - $i \\times j = k$, $j \\times k = i$, $k \\times i = j$ (순서를 거꾸로 하면 부호 −)
  - $\\vec{A} \\times \\vec{B} = (A_y B_z - A_z B_y) i + (A_z B_x - A_x B_z) j + (A_x B_y - A_y B_x) k$ (행렬식으로 계산)

**벡터의 미분** — 나블라 $\\nabla = \\frac{\\partial}{\\partial x} i + \\frac{\\partial}{\\partial y} j + \\frac{\\partial}{\\partial z} k$

| 연산 | 식 | 결과 |
| --- | --- | --- |
| 기울기 grad | $\\nabla V = \\frac{\\partial V}{\\partial x} i + \\frac{\\partial V}{\\partial y} j + \\frac{\\partial V}{\\partial z} k$ | 벡터 |
| 발산 div | $\\nabla \\cdot D = \\frac{\\partial D_x}{\\partial x} + \\frac{\\partial D_y}{\\partial y} + \\frac{\\partial D_z}{\\partial z}$ | 스칼라 (내적) |
| 회전 rot | $\\nabla \\times H$ (행렬식) | 벡터 (외적) |

**스토크스 정리**(선적분 ↔ 면적분): 선적분을 면적분으로 바꿀 때 rot을 붙인다.

$$
\\oint_c \\vec{H} \\cdot dl = \\int_s (\\nabla \\times \\vec{H})\\, ds = \\int_s (\\mathrm{rot}\\, \\vec{H})\\, ds
$$`,
      },
    ],
  },
  {
    id: "electrostatic-field",
    title: "정전계",
    cards: [
      {
        id: "electrostatic-field",
        title: "정전계",
        body: `정지된 전하가 만드는 전계. 전계 에너지가 **최소**가 되는 전하 분포의 전계이다.

**쿨롱의 법칙** — 두 점전하 사이의 힘은 전하의 곱에 비례, 거리의 제곱에 반비례

$$
F = \\frac{1}{4\\pi\\varepsilon_0} \\times \\frac{Q_1 Q_2}{r^2} = 9 \\times 10^9 \\times \\frac{Q_1 Q_2}{r^2}\\ [\\mathrm{N}]
$$

- 극성이 같으면 반발력(+), 다르면 흡인력(−)
- 유전율 $\\varepsilon = \\varepsilon_0 \\times \\varepsilon_s$ [F/m], $\\varepsilon_0 = 8.855 \\times 10^{-12}$ [F/m], 비유전율 $\\varepsilon_s$는 단위 없음(진공·공기 중 1)

**전계** — 단위 양전하 +1[C]이 받는 힘

- $E = \\frac{1}{4\\pi\\varepsilon_0} \\times \\frac{Q}{r^2} = 9 \\times 10^9 \\times \\frac{Q}{r^2}$ [V/m], $F = QE$ [N]
- +Q는 바깥으로 발산, −Q는 안쪽으로 흡수

**전기력선** — $Q$[C]에서 $\\frac{Q}{\\varepsilon}$개가 나온다

- 정전하(+)에서 시작해 부전하(−)에서 끝나며, 자신만으로 폐곡선을 이루지 못한다
- 전위가 높은 점 → 낮은 점 ($E = -\\mathrm{grad}\\, V$)
- 밀도 = 전계의 세기 ($E = \\frac{N}{S}$, 가우스 법칙)
- 도체 내부에는 없고, 도체 표면(등전위면)에 수직
- 방정식: $\\frac{dx}{E_x} = \\frac{dy}{E_y} = \\frac{dz}{E_z}$ (좌표 대입)

**전속** — $Q$[C]에서 $Q$개 (전속 = 전하량, 유전율의 영향을 받지 않음)

- 전속 밀도 $D = \\frac{Q}{S} = \\frac{Q}{4\\pi r^2}$ [C/m²], $D = \\varepsilon E$
- $\\varepsilon$이 커지면 $E$가 작아져 **$D$는 일정**

**전위** — +1[C]을 무한원점에서 그 점까지 옮기는 데 필요한 에너지

- $V = \\frac{1}{4\\pi\\varepsilon_0} \\times \\frac{Q}{r} = 9 \\times 10^9 \\times \\frac{Q}{r}$ [V]
- 전위차 $V_{AB} = V_A - V_B = \\frac{Q}{4\\pi\\varepsilon_0}\\left(\\frac{1}{a} - \\frac{1}{b}\\right)$ [V]
- 점전하: $V = Er$, 일반: $E = -\\nabla V = -\\mathrm{grad}\\, V$ (전계는 전위가 낮아지는 방향)

> 계산기 상수: $\\varepsilon_0$ = SHIFT → 7 → 32 → =, $\\mu_0$ = SHIFT → 7 → 33 → =`,
      },
      {
        id: "charged-conductor",
        title: "(대전된) 도체의 성질, 곡률과 전하 밀도의 관계",
        body: `**대전된 도체의 성질**

1. 전하는 도체 **표면에만** 존재하고 내부에는 없다
2. 도체 내부 전계는 0
3. 도체 표면(등전위면)에서 전계는 표면에 수직
4. 도체 표면과 내부는 등전위

- 정전 에너지는 도체 표면과 **외부 공간**에 존재한다
- 도체 내부의 공동면에는 전하가 분포하지 않는다 (단골 오답: "공동면에도 고르게 분포")

**곡률과 전하 밀도**

곡률이 클수록 = 곡률 반경이 작을수록 = 뾰족할수록 **전하 밀도가 커진다** (예: 피뢰침)

- 곡률 반경: 곡선에 접하는 원의 반지름`,
      },
      {
        id: "poisson-equation",
        title: "포아송 방정식 (Poisson's Equation)",
        body: `공간의 전위 분포를 알 때 그 공간의 **체적 전하 밀도**를 구하는 방정식.

$$
\\nabla^2 V = -\\frac{\\rho_v}{\\varepsilon}
$$

- $\\rho_v$: 체적 전하 밀도
- 단골 오답: $\\nabla^2 V = \\frac{\\rho_v}{\\varepsilon}$, $\\nabla^2 V = \\frac{\\varepsilon}{\\rho_v}$, $\\nabla^2 V = -\\frac{\\varepsilon}{\\rho_v}$
- 암기: **로마엡**`,
      },
      {
        id: "gauss-law",
        title: "가우스 법칙",
        body: `임의의 폐곡면을 지나는 전기력선의 밀도가 그 지점의 전계의 세기와 같다는 법칙.

$$
E = \\frac{N}{S} = \\frac{Q / \\varepsilon}{S} = \\frac{Q}{\\varepsilon S}
$$

- $E$: 전계, $N$: 전기력선의 수, $S$: 면적, $Q$: 전하량
- "폐곡면을 지나는 전속과 내부 전하의 관계를 나타내는 법칙" → 가우스 법칙
- 점전하는 쿨롱의 법칙, **분포된 전하**에 의한 전계는 가우스 법칙으로 구한다`,
      },
      {
        id: "field-potential-capacitance-summary",
        title: "정전계에 등장하는 전계, 전위, 정전용량, 저항 총정리",
        body: `$E = \\frac{Q}{\\varepsilon S}$ (가우스 법칙), $Q = CV$ $\\left(C = \\frac{Q}{V}\\right)$, $RC = \\rho\\varepsilon$ $\\left(R = \\frac{\\rho\\varepsilon}{C}\\right)$ 로 유도한다.

**구 (반지름 $a$)** — 점전하·구도체 외부: $E = \\frac{Q}{4\\pi\\varepsilon r^2}$, $V = \\frac{Q}{4\\pi\\varepsilon r}$

| 구도체 | 전계 $E$ | 전위 $V$ |
| --- | --- | --- |
| 외부 | $\\frac{Q}{4\\pi\\varepsilon r^2}$ | $\\frac{Q}{4\\pi\\varepsilon r}$ |
| 표면 | $\\frac{Q}{4\\pi\\varepsilon a^2}$ | $\\frac{Q}{4\\pi\\varepsilon a}$ |
| 내부 | $0$ | $\\frac{Q}{4\\pi\\varepsilon a}$ |

- 정전용량: 구 $C = 4\\pi\\varepsilon a$, 반구 $C = 2\\pi\\varepsilon a$
- 저항: 구 $R = \\frac{\\rho}{4\\pi a} = \\frac{1}{4\\pi k a}$, 반구 $R = \\frac{\\rho}{2\\pi a} = \\frac{1}{2\\pi k a}$

**동심구** (내도체 $+Q$, 반지름 $a$ / 외도체 $b$~$c$)

- 외도체 전하 0: $V_a = \\frac{Q}{4\\pi\\varepsilon}\\left(\\frac{1}{a} - \\frac{1}{b} + \\frac{1}{c}\\right)$
- 외도체 접지: 외부 $E = 0$, $V_a = \\frac{Q}{4\\pi\\varepsilon}\\left(\\frac{1}{a} - \\frac{1}{b}\\right)$
  - $C = \\frac{4\\pi\\varepsilon}{\\frac{1}{a} - \\frac{1}{b}} = \\frac{4\\pi\\varepsilon ab}{b - a}$, $R = \\frac{\\rho}{4\\pi}\\left(\\frac{1}{a} - \\frac{1}{b}\\right) = \\frac{1}{4\\pi k}\\left(\\frac{1}{a} - \\frac{1}{b}\\right)$

**선(원통)** — 선전하 밀도 $\\lambda = \\frac{Q}{l}$ [C/m]

| 구분 | 전계 $E$ | 전위차 $V_{ab}$ | $C$ [F/m] | $R$ |
| --- | --- | --- | --- | --- |
| 선전하 | $\\frac{\\lambda}{2\\pi\\varepsilon r}$ | $\\frac{\\lambda}{2\\pi\\varepsilon}\\ln\\frac{b}{a}$ (외부 전위 $\\infty$) | - | - |
| 동축케이블 | 사이 $\\frac{\\lambda}{2\\pi\\varepsilon r}$, 외부 0 | $\\frac{\\lambda}{2\\pi\\varepsilon}\\ln\\frac{b}{a}$ | $\\frac{2\\pi\\varepsilon}{\\ln\\frac{b}{a}}$ | $\\frac{1}{2\\pi k}\\ln\\frac{b}{a} = \\frac{\\rho}{2\\pi}\\ln\\frac{b}{a}$ |
| 평행 전선 | - | $\\frac{\\lambda}{\\pi\\varepsilon}\\ln\\frac{d-a}{a} \\approx \\frac{\\lambda}{\\pi\\varepsilon}\\ln\\frac{d}{a}$ ($d \\gg a$) | $\\frac{\\pi\\varepsilon}{\\ln\\frac{d}{a}}$ | $\\frac{\\rho}{\\pi}\\ln\\frac{d}{a} = \\frac{1}{\\pi k}\\ln\\frac{d}{a}$ |

- 평행 전선은 전선이 2개 → 동심원통 전위 공식 × 2

**면** — 면전하 밀도 $\\sigma = \\frac{Q}{S}$ [C/m²]

- 무한 도체 표면: $E = \\frac{\\sigma}{\\varepsilon}$, 무한 평면: $E = \\frac{\\sigma}{2\\varepsilon}$ (둘 다 거리 무관, 전위 $\\infty$)
- 평행판 콘덴서: 외부 $E = 0$, 내부 $E = \\frac{\\sigma}{\\varepsilon}$, $V = \\frac{\\sigma}{\\varepsilon} d$, $C = \\varepsilon\\frac{S}{d}$
- "무한히 넓은 도체판"처럼 '표면'이라는 말이 없으면 무한 평면으로 본다

**전기 쌍극자** — $+Q$, $-Q$가 거리 $d$만큼 떨어진 것, 모멘트 $M = Qd$ [C·m]

- $E = \\frac{M}{4\\pi\\varepsilon r^3}\\sqrt{1 + 3\\cos^2\\theta}$ [V/m], $V = \\frac{M\\cos\\theta}{4\\pi\\varepsilon r^2}$ [V]
- $\\theta = 0°$에서 최대, $\\theta = 90°$에서 최소
- 전위는 거리의 **제곱**, 전계는 거리의 **세제곱**에 반비례`,
      },
    ],
  },
  {
    id: "capacitance",
    title: "정전용량",
    cards: [
      {
        id: "capacitance",
        title: "정전용량",
        body: `도체에 전압을 걸었을 때 전하를 얼마나 저장할 수 있는지 나타내는 상수. 1[V]를 가했을 때 저장되는 전하량 $Q$[C]에 해당한다.

$$
C = \\frac{Q}{V}\\ [\\mathrm{F}] \\quad\\rightarrow\\quad Q = CV\\ [\\mathrm{C}],\\ \\ V = \\frac{Q}{C}\\ [\\mathrm{V}]
$$

- 콘덴서(커패시터): 전하를 저장하는 **소자**의 관점
- 정전용량(커패시턴스): 전하를 저장할 수 있는 **능력**의 관점
- 전기기기를 접지하는 이유: 지구의 정전용량이 커서 전위가 거의 일정하기 때문
- 평행판 콘덴서: 내부 전계 $E = \\frac{\\sigma}{\\varepsilon}$, 전위차 $V = \\frac{\\sigma}{\\varepsilon}d$ [V]

$$
C = \\frac{Q}{V} = \\frac{\\sigma S}{\\frac{\\sigma}{\\varepsilon}d} = \\varepsilon\\frac{S}{d}\\ [\\mathrm{F}]
$$`,
      },
      {
        id: "capacitor-series-parallel",
        title: "콘덴서의 직렬·병렬 연결",
        body: `| 구분 | 직렬 연결 | 병렬 연결 |
| --- | --- | --- |
| 일정한 값 | 전하량 $Q = Q_1 = Q_2$ [C] | 전압 $V = V_1 = V_2$ [V] |
| 합성 정전용량 | $C = \\frac{C_1 C_2}{C_1 + C_2}$ [F] | $C = C_1 + C_2$ [F] |
| 분배 | 전압은 정전용량에 **반비례** | 전하량은 정전용량에 **비례** |

**직렬 — 전압 분배**

$$
V_1 = V\\times\\frac{C_2}{C_1 + C_2},\\quad V_2 = V\\times\\frac{C_1}{C_1 + C_2}\\ [\\mathrm{V}]
$$

**병렬 — 전하량 분배**

$$
Q_1 = Q\\times\\frac{C_1}{C_1 + C_2},\\quad Q_2 = Q\\times\\frac{C_2}{C_1 + C_2}\\ [\\mathrm{C}]
$$

> 저항과 반대로 계산한다: 콘덴서 직렬 = 저항 병렬 공식, 콘덴서 병렬 = 저항 직렬 공식`,
      },
      {
        id: "capacitor-series-parallel-advanced",
        title: "콘덴서의 직렬·병렬 연결 심화",
        body: `**1. 직렬 연결: 가장 먼저 절연이 파괴되는 콘덴서**

최대 저장 전하량이 가장 작은 콘덴서가 먼저 절연파괴된다.

$$
Q_{\\max} = C V_{\\max}
$$

- $Q_{\\max}$: 최대 저장 전하량[C], $C$: 정전용량[F], $V_{\\max}$: 내압[V]
- 각 콘덴서의 $C \\times$ 내압을 계산해 가장 작은 것을 고른다

**2. 병렬 연결: 두 도체를 가는 도선으로 연결할 때 전하의 이동**

- 연결하면 두 도체의 전위가 같아지고 전하가 이동한다
- 전체 전하($Q_1 + Q_2$)가 **정전용량의 비**에 따라 다시 분배된다
- 이동한 전하 = (분배 후 전하) − (처음 전하)`,
      },
      {
        id: "dielectric-composite-capacitance",
        title: "유전체 삽입 시 합성 정전용량",
        body: `평행판 콘덴서에 유전체를 나누어 채우면, 나뉜 부분을 각각의 콘덴서로 보고 합성한다.

| 구분 | 직렬 연결 | 병렬 연결 |
| --- | --- | --- |
| 채우는 방향 | 극판과 **수평** 방향으로 채움 (간격이 나뉨) | 극판과 **수직** 방향으로 채움 (면적이 나뉨) |
| 합성 정전용량 | $C = \\frac{C_1 C_2}{C_1 + C_2}$ | $C = C_1 + C_2$ |

- 직렬: 같은 면적 $S$에 두께 $d_1$($\\varepsilon_1$), $d_2$($\\varepsilon_2$) 층이 쌓인 구조
- 병렬: 같은 간격 $d$에 면적 $S_1$($\\varepsilon_1$), $S_2$($\\varepsilon_2$)가 나란히 놓인 구조`,
      },
      {
        id: "capacitor-energy-force",
        title: "콘덴서에 저장(축적)되는 에너지, 정전 흡인력",
        body: `**1. 콘덴서에 저장되는 에너지 (정전 에너지)**

| 구분 | 공식 |
| --- | --- |
| 저장 에너지 [J] | $W = \\frac{1}{2}CV^2 = \\frac{1}{2}QV = \\frac{Q^2}{2C}$ ($\\because Q = CV$) |
| 단위 체적당 에너지 [J/m³] | $W = \\frac{1}{2}\\varepsilon E^2 = \\frac{1}{2}ED = \\frac{D^2}{2\\varepsilon}$ ($\\because D = \\varepsilon E$) |

**2. 정전 흡인력**

| 구분 | 공식 |
| --- | --- |
| 정전 흡인력 [N] | $F = \\frac{1}{2}\\varepsilon E^2 \\times S = \\frac{1}{2}ED \\times S = \\frac{D^2}{2\\varepsilon}\\times S$ |
| 단위 면적당 흡인력 [N/m²] | $F = \\frac{1}{2}\\varepsilon E^2 = \\frac{1}{2}ED = \\frac{D^2}{2\\varepsilon}$ |

- 단위 체적당 에너지와 단위 면적당 흡인력은 같은 식이다`,
      },
    ],
  },
  {
    id: "dielectric",
    title: "유전체",
    cards: [
      {
        id: "polarization",
        title: "분극의 세기",
        body: `외부 전계에 의해 유전체 내부 전하가 양전하와 음전하로 갈라져 극이 나뉘는 현상. **분극의 세기 $P$ [C/m²] = 유전체 표면 전하 밀도**.

$$
P = \\frac{Q}{S} = \\frac{Ql}{Sl} = \\frac{M}{V}\\ [\\mathrm{C/m^2}]
$$

$$
P = \\varepsilon_0(\\varepsilon_s - 1)E = D\\left(1 - \\frac{1}{\\varepsilon_s}\\right)\\ [\\mathrm{C/m^2}]
$$

- $M$: 전기 쌍극자 모멘트
- 분극률: $\\varepsilon_0(\\varepsilon_s - 1)$
- 비분극률: $\\varepsilon_s - 1$`,
      },
      {
        id: "dielectric-boundary-conditions",
        title: "유전체의 경계 조건",
        body: `수평·수직의 기준은 **경계면**이다. 경계면에는 전하가 없고, 경계면에서 전위는 서로 같다.

- 전계의 수평(접선)성분은 같다: $E_1\\sin\\theta_1 = E_2\\sin\\theta_2$
- 전속 밀도의 수직(법선)성분은 같다: $D_1\\cos\\theta_1 = D_2\\cos\\theta_2$
- $\\theta_1, \\theta_2$: 법선과 이루는 각도
- 유전율이 큰 쪽이 각도가 크다:

$$
\\frac{\\tan\\theta_2}{\\tan\\theta_1} = \\frac{\\varepsilon_2}{\\varepsilon_1}
$$

**유전율에 따른 대소관계**

| 조건 | 각도 | 전속 밀도 | 전계 |
| --- | --- | --- | --- |
| $\\varepsilon_1 > \\varepsilon_2$ | $\\theta_1 > \\theta_2$ | $D_1 > D_2$ | $E_1 < E_2$ |
| $\\varepsilon_1 < \\varepsilon_2$ | $\\theta_1 < \\theta_2$ | $D_1 < D_2$ | $E_1 > E_2$ |

- 전속선은 유전율이 큰 쪽으로 모인다
- 경계면에 **수평 입사**($\\theta_1 = \\theta_2 = 90^\\circ$): $E_1 = E_2$ (전계는 같고 전속 밀도는 다르다)
- 경계면에 **수직 입사**($\\theta_1 = \\theta_2 = 0^\\circ$): $D_1 = D_2$ (전속 밀도는 같고 전계는 다르다)`,
      },
      {
        id: "dielectric-boundary-force",
        title: "유전체 경계면에 작용하는 힘",
        body: `힘의 크기는 (큰 힘 − 작은 힘)이고, 힘은 **유전율이 큰 쪽에서 작은 쪽으로** 작용한다.

| 입사 방향 ($\\varepsilon_1 > \\varepsilon_2$) | 힘의 크기 | 방향 |
| --- | --- | --- |
| 수평 입사 (전계가 같다) | $F = \\frac{1}{2}(\\varepsilon_1 - \\varepsilon_2)E^2$ [N/m²] | $\\varepsilon_1$ → $\\varepsilon_2$ |
| 수직 입사 (전속 밀도가 같다) | $F = \\frac{1}{2}\\left(\\frac{1}{\\varepsilon_2} - \\frac{1}{\\varepsilon_1}\\right)D^2$ [N/m²] | $\\varepsilon_1$ → $\\varepsilon_2$ |

- 수평 입사는 $E$로, 수직 입사는 $D$로 쓴다 (경계에서 같은 값을 쓰는 것)`,
      },
    ],
  },
  {
    id: "image-method",
    title: "전기 영상법",
    cards: [
      {
        id: "image-method",
        title: "전기 영상법",
        body: `도체를 거울로 보고, 실제 전하와 대칭인 위치에 가상의 **영상전하**를 두어 점전하 간 계산으로 단순화하는 방법.

**1. 무한 평면 도체 — 점전하** (거리 $a$, 영상전하 $-Q$는 $2a$ 떨어짐)

$$
F = \\frac{1}{4\\pi\\varepsilon}\\times\\frac{Q\\times(-Q)}{(2a)^2} = -\\frac{Q^2}{16\\pi\\varepsilon a^2}\\ [\\mathrm{N}]
$$

- 부호 $-$ : 흡인력
- $+Q$를 무한원까지 운반하는 일: $W = \\frac{Q^2}{16\\pi\\varepsilon a}$ [J]
- 표면 전하 밀도의 최댓값: $\\sigma_{\\max} = -\\frac{Q}{2\\pi a^2}$ [C/m²]

**2. 무한 평면 도체 — 선전하** (지면으로부터 높이 $h$, 지면을 무한 평면 도체로 해석)

$$
F = -\\frac{\\lambda^2}{4\\pi\\varepsilon_0 h}\\ [\\mathrm{N/m}]
$$

- 선전하가 지면으로부터 받는 힘은 $h$에 **반비례**
- 선전하의 길이가 무한대이므로 단위 길이당 힘[N/m]으로 나타낸다

**3. 접지 구도체** (반지름 $a$, 중심에서 $d$ 떨어진 점전하 $+Q$)

- 영상전하의 크기: $Q' = -\\frac{a}{d}Q$ [C]
- 영상전하의 위치(중심으로부터): $x = \\frac{a^2}{d}$ [m]`,
      },
    ],
  },
  {
    id: "current",
    title: "전류",
    cards: [
      {
        id: "conduction-displacement-current",
        title: "전도전류와 변위전류",
        body: `**1. 전도전류**: 도체에서 전하가 실제로 이동하며 생기는 전류

$$
I_c = \\frac{Q}{t} = \\frac{ne}{t}\\ [\\mathrm{A}],\\qquad i_c = \\frac{1}{\\rho}E = kE = \\sigma E\\ [\\mathrm{A/m^2}]
$$

- $\\rho$: 고유저항, $k(\\sigma)$: 도전율
- 전자 1개의 전하량 $e = -1.602\\times10^{-19}$ [C]
- 전하량 공식 총정리: $Q = CV = It = ne$

**2. 변위전류**: **유전체**를 통해 흐르는 가상의 전류로, **자계를 발생**시킨다

$$
I_d = \\omega C V_m\\cos\\omega t\\ [\\mathrm{A}],\\qquad i_d = \\frac{dD}{dt} = \\varepsilon\\frac{dE}{dt} = \\omega\\varepsilon E = 2\\pi f\\varepsilon E\\ [\\mathrm{A/m^2}]
$$

- $E = E_m\\sin\\omega t$이면 최댓값 $\\omega\\varepsilon E_m$, 실횻값 $\\omega\\varepsilon E$
- 평행판 콘덴서($C = \\varepsilon\\frac{S}{d}$)에서: $i_d = \\frac{\\omega\\varepsilon V_m}{d}\\cos\\omega t$ [A/m²]

**3. 임계 주파수**: 전도전류와 변위전류의 크기가 같아지는 주파수

$$
f_c = \\frac{\\sigma}{2\\pi\\varepsilon}
$$

- 변위전류를 무시하려면 $i_c \\gg i_d$, 즉 $\\frac{\\sigma}{2\\pi\\varepsilon} \\gg f$`,
      },
      {
        id: "electric-resistance",
        title: "전기 저항",
        body: `| 회로적 관점 | 물리적 관점 |
| --- | --- |
| $R = \\frac{V}{I}$ [Ω] | $R = \\rho\\frac{l}{S}$ [Ω] |

- $\\rho$: 고유저항, $l$: 길이, $S$: 단면적
- 체적이 일정할 때 길이를 $n$배로 늘리면 단면적은 $\\frac{1}{n}$배가 되어 저항은 $n^2$배
  - 예: 길이 2배 → 저항 4배`,
      },
      {
        id: "resistance-capacitance-relation",
        title: "저항, 정전용량의 관계",
        body: `도체의 길이 $l$과 극판 사이 거리 $d$를 같은 것으로 보고 $R = \\rho\\frac{l}{S}$와 $C = \\varepsilon\\frac{S}{d}$를 곱하면:

$$
RC = \\rho\\varepsilon
$$

- 저항: $R = \\frac{\\rho\\varepsilon}{C}$ [Ω]
- 누설전류: $I_l = \\frac{V}{R} = \\frac{CV}{\\rho\\varepsilon}$ [A]`,
      },
      {
        id: "thermoelectric-effect",
        title: "열전 현상",
        body: `열에너지와 전기에너지가 서로 변환되는 현상.

| 효과 | 내용 |
| --- | --- |
| 톰슨 효과 | **동일한 금속** 도선의 두 점에 온도차를 주고 전류를 흘리면 열이 발생하거나 흡수됨 |
| 펠티에 효과 | **두 종류의 금속**으로 폐회로를 만들고 **전류**를 흘리면 접속점에 **온도 차**가 생김 |
| 제벡 효과 | 두 종류의 금속으로 폐회로를 만들고 접속점의 온도를 다르게 하면 기전력이 생겨 전류가 흐름 |

- 시험에는 **톰슨 효과**와 **펠티에 효과**가 주로 나온다
- 암기: "**펠**프스가 **IT**기업을 다닌다" → 펠티에: 전류($I$)를 흘리면 온도($T$) 차`,
      },
    ],
  },
  {
    id: "electrostatic-vs-magnetostatic",
    title: "정전계와 정자계",
    cards: [
      {
        id: "electrostatic-vs-magnetostatic",
        title: "정전계 vs 정자계",
        body: `정전계의 식에서 $Q \\to m$, $\\varepsilon \\to \\mu$, $E \\to H$, $V \\to U$, $D \\to B$로 바꾸면 정자계의 식이 된다. 두 계를 짝지어 외우는 것이 핵심.

| 항목 | 정전계 | 정자계 |
| --- | --- | --- |
| 기본량 | 전하량 $Q$ [C] | 자하량 $m$ [Wb] |
| 매질 상수 | $\\varepsilon = \\varepsilon_0 \\varepsilon_s$ [F/m] | $\\mu = \\mu_0 \\mu_s$ [H/m] |
| 쿨롱의 법칙 [N] | $F = \\frac{1}{4\\pi\\varepsilon} \\times \\frac{Q_1 Q_2}{r^2}$ | $F = \\frac{1}{4\\pi\\mu} \\times \\frac{m_1 m_2}{r^2}$ |
| 세기 | $E = \\frac{1}{4\\pi\\varepsilon} \\times \\frac{Q}{r^2}$ [V/m] | $H = \\frac{1}{4\\pi\\mu} \\times \\frac{m}{r^2}$ [AT/m] |
| 전위·자위 | $V = \\frac{1}{4\\pi\\varepsilon} \\times \\frac{Q}{r}$ [V] | $U = \\frac{1}{4\\pi\\mu} \\times \\frac{m}{r}$ [AT] |
| 력선의 수 | $N = \\frac{Q}{\\varepsilon}$ | $N = \\frac{m}{\\mu}$ |
| 속 | 전속 $Q$ [C] | 자속 $m = \\phi$ [Wb] |
| 속 밀도 | $D = \\frac{Q}{S}$ [C/m²] | $B = \\frac{\\phi}{S}$ [Wb/m²] |
| 관계식 | $F = QE$, $V = Er$, $E = -\\mathrm{grad}\\,V$, $D = \\varepsilon E$ | $F = mH$, $U = Hr$, $H = -\\mathrm{grad}\\,U$, $B = \\mu H$ |
| 쌍극자 세기 | $E = \\frac{M}{4\\pi\\varepsilon r^3}\\sqrt{1 + 3\\cos^2\\theta}$ | $H = \\frac{M}{4\\pi\\mu r^3}\\sqrt{1 + 3\\cos^2\\theta}$ |
| 쌍극자 전위·자위 | $V = \\frac{M\\cos\\theta}{4\\pi\\varepsilon r^2}$ | $U = \\frac{M\\cos\\theta}{4\\pi\\mu r^2}$ |
| 저장 에너지 [J] | $W = \\frac{1}{2}CV^2 = \\frac{1}{2}QV = \\frac{Q^2}{2C}$ | $W = \\frac{1}{2}LI^2$ |
| 단위 체적당 에너지 [J/m³] | $W = \\frac{1}{2}\\varepsilon E^2 = \\frac{1}{2}ED = \\frac{D^2}{2\\varepsilon}$ | $W = \\frac{1}{2}\\mu H^2 = \\frac{1}{2}BH = \\frac{B^2}{2\\mu}$ |
| 분극·자화의 세기 | $P = \\varepsilon_0(\\varepsilon_s - 1)E = D\\left(1 - \\frac{1}{\\varepsilon_s}\\right)$ [C/m²] | $J = \\mu_0(\\mu_s - 1)H = B\\left(1 - \\frac{1}{\\mu_s}\\right)$ [Wb/m²] |

- 진공(공기) 중: $\\varepsilon_0 = 8.855 \\times 10^{-12}$, $\\mu_0 = 4\\pi \\times 10^{-7}$
- 단위 체적당 에너지 [J/m³]는 단위 면적당 힘 [N/m²]과 같다
- 분극률 $\\varepsilon_0(\\varepsilon_s - 1)$, 비분극률 $\\varepsilon_s - 1$ / 자화율 $\\mu_0(\\mu_s - 1)$, 비자화율 $\\mu_s - 1$
- 경계조건: $E_1\\sin\\theta_1 = E_2\\sin\\theta_2$, $D_1\\cos\\theta_1 = D_2\\cos\\theta_2$, $\\frac{\\tan\\theta_2}{\\tan\\theta_1} = \\frac{\\varepsilon_2}{\\varepsilon_1}$ (자성체는 $H$, $B$, $\\mu$로 동일)
- $\\varepsilon_1 > \\varepsilon_2$이면 $\\theta_1 > \\theta_2$, $D_1 > D_2$, $E_1 < E_2$ ($\\mu_1 > \\mu_2$이면 $\\theta_1 > \\theta_2$, $B_1 > B_2$, $H_1 < H_2$)`,
      },
    ],
  },
  {
    id: "current-force-and-field",
    title: "전류에 의한 힘과 자계",
    cards: [
      {
        id: "fleming-ampere",
        title: "플레밍의 왼손 법칙, 앙페르의 오른손 법칙",
        body: `전류와 자계, 힘의 **방향**을 손 모양으로 결정하는 두 법칙.

**플레밍의 왼손 법칙** — 자계 속 도체에 전류가 흐를 때 도체가 받는 힘의 방향을 정한다 (→ **전동기의 원리**)
- 엄지: 힘, 검지: 자계, 중지: 전류

**앙페르의 오른손 법칙** — 전류가 만드는 자계의 방향을 정한다

| 구분 | 엄지손가락 | 네 손가락 |
| --- | --- | --- |
| 직선 전류 | 전류 | 자계 |
| 원형 전류(코일) | 자계 | 전류 |

> 직선과 원형은 반대! 원형 전류는 직선 전류의 손가락 역할을 바꿔 적용한다.`,
      },
      {
        id: "force-on-conductor",
        title: "도체가 받는 힘",
        body: `자계 속에서 전류(또는 움직이는 전하)가 받는 힘과 회전력.

**자계 속 도체가 받는 힘**

$$
F = (I \\times B)l = BIl\\sin\\theta \\ [\\mathrm{N}]
$$

- $\\theta$: 도체와 자계가 이루는 각도 (암기: "빌 아저씨의 사인")

**무한 평행 도선 사이의 힘**

$$
F = 2 \\times \\frac{I_1 I_2}{r} \\times 10^{-7} \\ [\\mathrm{N/m}]
$$

- 같은 방향 전류 → **흡인력**, 반대 방향 전류 → **반발력**

**자계에 수직 입사한 전하** — 전자력(구심력) $F_m = Bvq$ (암기: "바베큐")를 받아 원운동한다
- 원의 반지름은 **자계의 세기에 반비례** (자계가 강할수록 작게 돈다)

**자계 속 회전력(토크)**
- 막대자석: $T = M \\times H = MH\\sin\\theta = mlH\\sin\\theta$ [N·m], 자기 모멘트 $M = ml$ [Wb·m]
- 코일: $T = BINS\\cos\\theta$ [N·m] (사각 코일 $S = a \\times b$, 원형 코일 $S = \\pi r^2$)
- $\\theta$: 막대자석(코일)과 자계가 이루는 각도`,
      },
      {
        id: "field-by-current",
        title: "전류에 의한 자계",
        body: `무한 전류는 **앙페르의 주회 적분 법칙**, 유한 전류는 **비오-사바르 법칙**으로 자계를 구한다.

**앙페르의 주회 적분 법칙**: $Hl = NI \\rightarrow H = \\frac{NI}{l}$ [AT/m]

| 형태 | 자계의 세기 [AT/m] |
| --- | --- |
| 무한 직선 전류 | $H = \\frac{I}{2\\pi r}$ |
| 무한 솔레노이드 내부 | $H = \\frac{NI}{l} = n_0 I$ ($n_0$: 단위 길이당 권수) |
| 환상 솔레노이드 내부 | $H = \\frac{NI}{2\\pi r}$ ($r$: 평균반지름) |
| 원형 코일 중심축 위 | $H = \\frac{a^2 I}{2(a^2 + b^2)^{\\frac{3}{2}}}$ |
| 원형 코일 중심 | $H = \\frac{NI}{2a}$ (중심축 식에서 $b = 0$) |
| 정삼각형 코일 중심 | $H_3 = \\frac{9}{2} \\times \\frac{I}{\\pi l}$ |
| 정사각형 코일 중심 | $H_4 = 2\\sqrt{2} \\times \\frac{I}{\\pi l}$ |

**비오-사바르 법칙**: $H = \\frac{Il\\sin\\theta}{4\\pi r^2} \\propto \\frac{I}{r^2}$ → 자계는 전류에 비례, 거리 제곱에 반비례 (암기: "$4\\pi r^2$분의 일사")

- 무한 솔레노이드 내부는 거리와 무관한 **평등 자장**, 외부 자계 $H = 0$
- 환상 솔레노이드는 외부 자계 = 0, 중심 자계 = 0
- 반원 코일 중심 자계는 원형 코일 중심 자계의 $\\frac{1}{2}$
- 정삼각형·정사각형의 $l$은 한 변의 길이 (암기: "삼겹살 구이")`,
      },
    ],
  },
  {
    id: "magnetic-circuit",
    title: "자기회로",
    cards: [
      {
        id: "electric-vs-magnetic-circuit",
        title: "전기회로 vs 자기회로",
        body: `자기회로는 전기회로와 1:1로 대응시켜 이해한다. 기전력 → 기자력, 전류 → 자속, 전기저항 → 자기저항, 도전율 → 투자율.

| 전기회로 | 공식 | 자기회로 | 공식 |
| --- | --- | --- | --- |
| 기전력 | $E = IR$ [V] | 기자력 | $F = NI = \\phi R_m$ [AT] |
| 전류 | $I = \\frac{E}{R}$ [A] | 자속 | $\\phi = \\frac{F}{R_m} = \\frac{NI}{l/\\mu S} = \\frac{\\mu S N I}{l}$ [Wb] |
| 전기저항 | $R = \\rho\\frac{l}{S} = \\frac{l}{kS}$ [Ω] | 자기저항 | $R_m = \\frac{l}{\\mu S}$ [AT/Wb] |
| 도전율 | $k$ [℧/m] | 투자율 | $\\mu$ [H/m] |

- 저항률과 도전율의 관계: $\\rho = \\frac{1}{k}$
- **단골 오답**: 도전율에 대응하는 것은 **투자율**이다 (유전율이 아님)`,
      },
      {
        id: "magnetic-circuit-with-air-gap",
        title: "공극을 가진 자기회로",
        body: `철심에 공극이 생기면 철심과 공극이 같은 자속을 공유하므로 두 자기저항이 **직렬**로 더해진다.

- 공극이 없을 때: $R_m = \\frac{l}{\\mu S}$
- 공극이 있을 때 (철심 $l \\gg l_g$ 이면 $R_m \\approx \\frac{l}{\\mu S}$, 공극 $R_g = \\frac{l_g}{\\mu_0 S}$)

$$
R = R_m + R_g = \\frac{l}{\\mu S} + \\frac{l_g}{\\mu_0 S}
$$

**자기저항의 증가율** (기출 단골)

$$
\\frac{R}{R_m} = 1 + \\frac{\\mu l_g}{\\mu_0 l}
$$

- 미소 공극 $l_g$를 만들면 자기저항은 처음의 $1 + \\frac{\\mu l_g}{\\mu_0 l}$ 배가 된다`,
      },
      {
        id: "magnetic-materials",
        title: "자성체",
        body: `자계 안에서 자석의 성질을 띠게 되는 물질. 전계의 유전체에 대응한다.

| 구분 | 비투자율 | 자화율 | 종류 |
| --- | --- | --- | --- |
| 강자성체 | $\\mu_s \\gg 1$ | $\\chi \\gg 0$ | 코발트, 철, 니켈 |
| 상자성체 | $\\mu_s > 1$ | $\\chi > 0$ | |
| 반자성체(역자성체) | $\\mu_s < 1$ | $\\chi < 0$ | |

- 자화율: $\\chi = \\mu_0(\\mu_s - 1)$
- 강자성체 암기: **코·철·니** (코발트, 철, 니켈)
- **자기 차폐**: 비투자율이 큰 강자성체로 감싸서 외부 자계의 영향을 막는 것`,
      },
      {
        id: "hysteresis-curve",
        title: "히스테리시스 곡선",
        body: `자화의 이력(경력)이 있을 때와 없을 때 B-H 곡선이 달라지는 것을 나타낸 곡선 (자기 이력 곡선).

| 가로축 | 세로축 | 기울기 | 면적 |
| --- | --- | --- | --- |
| 자계의 세기 $H$ | 자속밀도 $B$ | 투자율 $\\mu = \\frac{B}{H}$ | 히스테리시스 손실 |

- **잔류자기 $B_r$** (곡선과 세로축의 교점): 외부 자계를 0으로 해도 남는 자속밀도
- **보자력 $H_c$** (곡선과 가로축의 교점): 잔류자기를 0으로 만들기 위해 반대 방향으로 가해야 하는 자계
- 영구자석: $B_r$ 크고 $H_c$ **크다** / 전자석: $B_r$ 크고 $H_c$ **작다**
- **단골 오답**: "자화의 경력이 있든 없든 곡선 모양은 같다" (X)`,
      },
    ],
  },
  {
    id: "electromagnetic-induction",
    title: "전자유도",
    cards: [
      {
        id: "faraday-lenz-law",
        title: "패러데이·렌츠의 법칙",
        body: `$$
e = -N\\frac{d\\phi}{dt} \\ [\\mathrm{V}]
$$

- **패러데이 법칙**: 자속이 시간에 따라 변하면 유도기전력이 생긴다 → 크기 $N\\frac{d\\phi}{dt}$
- **렌츠 법칙**: 유도기전력은 자속 변화를 **방해하는 방향**으로 생긴다 → 식의 $-$ 부호
- 공식 한 줄로 기억: 크기는 패러데이, 부호(방향)는 렌츠`,
      },
      {
        id: "motional-emf",
        title: "유도기전력",
        body: `길이 $l$인 도체가 속도 $v$로 자속밀도 $B$를 끊을 때 생기는 기전력.

$$
e = (v \\times B)\\,l = Blv\\sin\\theta \\ [\\mathrm{V}]
$$

- $\\theta$: 속도 $v$와 자속밀도 $B$가 이루는 각
- 암기: "브라보 사인" → $Blv\\sin\\theta$
- 방향은 **플레밍의 오른손 법칙** (엄지: 운동 방향 $v$, 검지: 자계 방향 $B$, 중지: 유도기전력 $e$) → **발전기**의 원리`,
      },
      {
        id: "skin-effect",
        title: "표피효과",
        body: `교류 전류가 도체 중심보다 **표면 쪽에 몰려** 흐르는 현상 (표면의 전류밀도가 더 크다).

**침투깊이**

$$
\\delta = \\frac{1}{\\sqrt{\\pi f \\mu k}} \\ [\\mathrm{m}]
$$

- $f$: 주파수, $\\mu$: 투자율, $k(\\sigma)$: 도전율
- 암기: "파프리카" → $\\pi f \\mu k$
- $f$, $\\mu$, $k$가 클수록 침투깊이 $\\delta$는 작아진다 (표피효과가 커진다)`,
      },
    ],
  },
  {
    id: "inductance",
    title: "인덕턴스",
    cards: [
      {
        id: "inductance",
        title: "인덕턴스",
        body: `도체에 1[A]를 흘렸을 때 자속을 얼마나 만들어내는지 나타내는 상수 (코일 = 소자, 인덕턴스 = 그 능력).

**자기 인덕턴스** (자기 전류에 의한 자속, 항상 **정(+)**)

$$
L = \\frac{N\\phi}{I} = \\frac{\\mu S N^2}{l} \\ [\\mathrm{H}] \\quad \\left(\\because \\phi = \\frac{\\mu S N I}{l}\\right)
$$

- 전류 변화에 의한 유기기전력: $LI = N\\phi$ 이므로 $e = -L\\frac{di}{dt}$ [V]

**상호 인덕턴스** (다른 코일의 전류에 의한 자속)
- $M = \\frac{\\mu S N_1 N_2}{l}$ [H]
- $M = L_1\\frac{N_2}{N_1} = L_2\\frac{N_1}{N_2}$ [H] → 권수와 자기 인덕턴스가 주어질 때
- $M = k\\sqrt{L_1 L_2}$, 결합계수 $k = \\frac{M}{\\sqrt{L_1 L_2}}$, $0 \\le k \\le 1$

**직렬 접속**

| 가동 접속 (자속 방향 같음) | 차동 접속 (자속 방향 반대) |
| --- | --- |
| $L = L_1 + L_2 + 2M$ [H] | $L = L_1 + L_2 - 2M$ [H] |`,
      },
      {
        id: "self-inductance-by-conductor",
        title: "도체에 따른 자기 인덕턴스",
        body: `**무한장 솔레노이드** (단위 길이당, $n_0 = \\frac{N}{l}$: 단위 길이당 권수)

$$
L = \\frac{\\mu S N^2}{l^2} = \\mu S n_0^2 \\ [\\mathrm{H/m}]
$$

**환상 솔레노이드**

$$
L = \\frac{\\mu S N^2}{l} \\ [\\mathrm{H}]
$$

**동축 케이블** (단위 길이당)

$$
L = L_{\\text{내부}} + L_{\\text{외부}} = \\frac{\\mu_{\\text{내부}}}{8\\pi} + \\frac{\\mu_{\\text{외부}}}{2\\pi}\\ln\\frac{b}{a} \\ [\\mathrm{H/m}]
$$

- 외부 인덕턴스 유도: $LC = \\varepsilon\\mu$ 와 동축케이블 정전용량 $C = \\frac{2\\pi\\varepsilon}{\\ln\\frac{b}{a}}$ 를 이용 → $L_{\\text{외부}} = \\frac{\\varepsilon\\mu}{C}$`,
      },
    ],
  },
  {
    id: "electromagnetic-field",
    title: "전자계",
    cards: [
      {
        id: "wave-speed-wavelength-impedance",
        title: "전자파의 속도, 파장, 특성 임피던스",
        body: `**속도** [m/s]

$$
v = \\frac{1}{\\sqrt{\\varepsilon\\mu}} = 3\\times10^8 \\times \\frac{1}{\\sqrt{\\varepsilon_s\\mu_s}}
$$

**파장** [m]

$$
\\lambda = \\frac{v}{f} = \\frac{1}{f\\sqrt{\\varepsilon\\mu}} = 3\\times10^8 \\times \\frac{1}{f\\sqrt{\\varepsilon_s\\mu_s}}
$$

**특성(파동·고유) 임피던스** [Ω]

$$
Z_0 = \\frac{E}{H} = \\sqrt{\\frac{\\mu}{\\varepsilon}} = 377\\sqrt{\\frac{\\mu_s}{\\varepsilon_s}}
$$

- 진공·공기 중($\\varepsilon_s = \\mu_s = 1$): $v = 3\\times10^8$ [m/s], $Z_0 = 377$ [Ω]
- 진공에서 전계와 자계: $\\frac{E}{H} = 377$, $E = 377H$, $H = \\frac{E}{377}$`,
      },
      {
        id: "poynting-vector",
        title: "포인팅 벡터(Poynting Vector)",
        body: `전자계에서 에너지의 흐름을 **단위 면적당 전력**으로 나타낸 벡터.

$$
S = E \\times H = EH\\sin\\theta = EH \\ [\\mathrm{W/m^2}]
$$

$$
S = \\frac{\\text{전력}}{\\text{면적}} = \\frac{P}{4\\pi r^2} \\ [\\mathrm{W/m^2}]
$$

- 전자기학에서 단위가 [W/m²]인 물리량은 포인팅 벡터뿐 → 문제에서 [W/m²]를 묻으면 바로 포인팅 벡터로 풀이`,
      },
      {
        id: "maxwell-equations",
        title: "맥스웰의 전자 방정식",
        body: `| 법칙 | 의미 | 공식 |
| --- | --- | --- |
| 가우스 정리 (전속) | 전하는 단독으로 존재할 수 있다 | $div\\,D = \\rho$ |
| 가우스 정리 (자속) | 자하는 단독으로 존재할 수 없다 | $div\\,B = 0$ |
| 패러데이 법칙 | 자속밀도의 시간 변화가 전계를 회전시킨다 | $rot\\,E = -\\frac{\\partial B}{\\partial t}$ |
| 앙페르의 주회 적분 법칙 | 전도전류·변위전류가 회전하는 자계를 만든다 | $rot\\,H = i_c + i_d$ |

- 자속밀도 $B$에 관한 식은 결과가 모두 0: $div\\,B = 0$, $\\oint B \\cdot dS = 0$
- **단골 오답**: $div\\,B = \\phi$, $div\\,B = i$, $div\\,B = \\mu H$, $\\oint_s B \\cdot dS = \\rho_s$ (모두 X)`,
      },
      {
        id: "wave-equation",
        title: "파동 방정식(전기파, 자기파 방정식)",
        body: `| 전기파 | 자기파 |
| --- | --- |
| $\\nabla^2 E = \\varepsilon\\mu\\frac{\\partial^2 E}{\\partial t^2}$ | $\\nabla^2 H = \\varepsilon\\mu\\frac{\\partial^2 H}{\\partial t^2}$ |

- 특징: ① 모두 제곱(2차) 형태 ② 모두 양수(+) ③ $\\varepsilon$과 $\\mu$로만 구성`,
      },
    ],
  },
];
