import React from 'react';
import {interpolate} from 'remotion';
import {Cena} from '../arte/Cena';
import {Brilhos, Estrela, Interrogacao, Nuvem, useSegundos} from '../arte/Objetos';
import {LIA, Pessoa} from '../arte/Pessoa';
import {nunito} from '../fontes';
import {type Deixa, momento} from '../tempo';
import {cores, entre, pop} from '../util';

type P = {fala: Deixa};
const dur = (f: Deixa) => f.duracao + f.pausa;

/** "Se você já pediu desculpas por algo que nem sabe direito o que fez…" */
export const CenaDesculpa: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const msg = 'Desculpa…';
  const digitadas = Math.floor(entre(t, 0.7, 2.2, 0, msg.length));
  const enviada = t > 2.4;
  const tQuest = momento(fala, 'nem sabe');
  return (
    <Cena fundo={cores.noite} dur={dur(fala)} decoracao="#8ecae6">
      {/* janela com lua */}
      <rect x={140} y={120} width={360} height={300} rx={20} fill="#1a2247" stroke="#0f1533" strokeWidth={12} />
      <circle cx={380} cy={220} r={55} fill="#fff3b0" />
      <circle cx={405} cy={205} r={50} fill="#1a2247" />
      {[
        [210, 180],
        [260, 330],
        [440, 340],
        [320, 160],
      ].map(([x, y], i) => (
        <Estrela key={i} x={x} y={y} r={10} brilho={0.5 + 0.5 * Math.sin(t * 3 + i)} />
      ))}
      {/* brilho da tela no rosto */}
      <circle cx={620} cy={720} r={300} fill="#bde0fe" opacity={0.16} />
      <Pessoa x={620} y={1030} s={1.45} {...LIA} humor={t > tQuest ? 'confusa' : 'preocupada'} olhar={0.2} bracos="celular" />
      <g opacity={entre(t, tQuest, tQuest + 0.3)} transform={`translate(0 ${-14 * Math.sin(t * 3)})`}>
        <Interrogacao x={860} y={300} s={1.1} />
      </g>
      {/* celular em destaque */}
      <g transform={`translate(1360 520) scale(${pop(t, 0.05, 0.5)}) rotate(4)`}>
        <rect x={-230} y={-420} width={460} height={840} rx={60} fill="#1b1b2f" stroke={cores.tinta} strokeWidth={8} />
        <rect x={-205} y={-385} width={410} height={770} rx={36} fill="#f8f9fa" />
        <rect x={-205} y={-385} width={410} height={100} rx={36} fill="#e9ecef" />
        <circle cx={-140} cy={-335} r={30} fill={cores.coral} />
        <text x={-95} y={-322} fontFamily={nunito} fontWeight={800} fontSize={36} fill={cores.tinta}>
          Ele
        </text>
        {/* mensagem recebida */}
        <g opacity={entre(t, 0.25, 0.5)}>
          <rect x={-185} y={-250} width={300} height={110} rx={28} fill="#dee2e6" />
          <text x={-160} y={-205} fontFamily={nunito} fontWeight={700} fontSize={32} fill={cores.tinta}>
            Você sabe o
          </text>
          <text x={-160} y={-165} fontFamily={nunito} fontWeight={700} fontSize={32} fill={cores.tinta}>
            que fez…
          </text>
        </g>
        {/* mensagem enviada */}
        {enviada ? (
          <g transform={`translate(0 ${interpolate(t, [2.4, 2.7], [40, 0], {extrapolateRight: 'clamp'})})`}>
            <rect x={-10} y={-100} width={195} height={80} rx={28} fill="#95d5b2" />
            <text x={10} y={-48} fontFamily={nunito} fontWeight={800} fontSize={34} fill={cores.tinta}>
              {msg}
            </text>
          </g>
        ) : null}
        {/* campo de digitação */}
        <rect x={-185} y={290} width={370} height={70} rx={35} fill="#fff" stroke="#ced4da" strokeWidth={4} />
        <text x={-160} y={337} fontFamily={nunito} fontWeight={700} fontSize={34} fill={cores.tinta}>
          {enviada ? '' : msg.slice(0, digitadas)}
          {!enviada && Math.floor(t * 3) % 2 === 0 ? '|' : ''}
        </text>
      </g>
    </Cena>
  );
};

/** "este vídeo é pra você." */
export const CenaPraVoce: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  return (
    <Cena fundo={cores.pessego} dur={dur(fala)}>
      <g transform={`translate(960 560) rotate(${t * 20})`} opacity={0.55}>
        {new Array(12).fill(0).map((_, i) => (
          <path key={i} d="M 0 0 L -90 -1100 L 90 -1100 Z" fill={cores.amarelo} transform={`rotate(${i * 30})`} />
        ))}
      </g>
      <circle cx={960} cy={560} r={entre(t, 0, 0.5, 0, 330)} fill="#fff" opacity={0.6} />
      <Pessoa x={960} y={1050} s={1.55} {...LIA} humor={t < 0.7 ? 'surpresa' : 'feliz'} />
      <Brilhos x={960} y={560} raio={420} qtd={8} cor="#fff" visivel={entre(t, 0.3, 0.6)} />
    </Cena>
  );
};

/** "Porque a manipulação mais eficiente não grita." */
export const CenaNaoGrita: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const tNao = momento(fala, 'não grita');
  const risco = entre(t, tNao, tNao + 0.45);
  const encolhe = entre(t, tNao + 0.2, tNao + 0.8, 1, 0.82);
  const pulso = 1 + 0.06 * Math.sin(t * 22);
  return (
    <Cena fundo={cores.amarelo} dur={dur(fala)}>
      <g transform={`translate(900 480) scale(${encolhe * pop(t, 0, 0.5)})`}>
        {/* ondas do grito */}
        <g opacity={1 - risco * 0.7} transform={`scale(${pulso})`}>
          {[0, 1, 2].map((i) => (
            <path
              key={i}
              d={`M ${300 + i * 90} -${150 + i * 50} L ${340 + i * 90} -${60 + i * 20} L ${300 + i * 90} 0 L ${340 + i * 90} ${60 + i * 20} L ${300 + i * 90} ${150 + i * 50}`}
              stroke={cores.coral}
              strokeWidth={22}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          ))}
        </g>
        {/* megafone */}
        <rect x={-330} y={-70} width={140} height={140} rx={24} fill="#e5e5e5" stroke={cores.tinta} strokeWidth={8} />
        <path d="M -200 -70 L 220 -230 L 220 230 L -200 70 Z" fill={cores.coral} stroke={cores.tinta} strokeWidth={8} strokeLinejoin="round" />
        <ellipse cx={220} cy={0} rx={50} ry={230} fill="#ff8787" stroke={cores.tinta} strokeWidth={8} />
        <rect x={-150} y={70} width={60} height={150} rx={20} fill={cores.tinta} />
      </g>
      {/* X vermelho */}
      <g stroke="#d00000" strokeWidth={46} strokeLinecap="round" fill="none">
        <path d="M 600 200 L 1300 800" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - entre(t, tNao, tNao + 0.25)} />
        <path d="M 1300 200 L 600 800" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - entre(t, tNao + 0.2, tNao + 0.45)} />
      </g>
    </Cena>
  );
};

/** "Ela sussurra." */
export const CenaSussurra: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  return (
    <Cena fundo={cores.lavanda} dur={dur(fala)} decoracao="#5a3d9a">
      {/* sombra que sussurra */}
      <g opacity={entre(t, 0, 0.4, 0, 0.9)} transform={`translate(${entre(t, 0, 1.2, -60, 0)} 0)`}>
        <ellipse cx={720} cy={470} rx={125} ry={135} fill="#5a3d9a" />
        <path d="M 520 1080 C 520 780 600 640 720 640 C 840 640 920 780 920 1080 Z" fill="#5a3d9a" />
        <ellipse cx={770} cy={460} rx={18} ry={8} fill="#cdb4ff" opacity={0.8} />
        <ellipse cx={690} cy={460} rx={18} ry={8} fill="#cdb4ff" opacity={0.8} />
      </g>
      {/* ondinhas do sussurro */}
      {[0, 1, 2].map((i) => (
        <path
          key={i}
          d={`M ${880 + i * 40} ${470 - 30 - i * 14} Q ${900 + i * 40} 470 ${880 + i * 40} ${470 + 30 + i * 14}`}
          stroke="#fff"
          strokeWidth={10}
          fill="none"
          strokeLinecap="round"
          opacity={entre(t, 0.3 + i * 0.2, 0.5 + i * 0.2) * (0.6 + 0.4 * Math.sin(t * 8 - i))}
        />
      ))}
      <text x={930} y={360} fontFamily={nunito} fontWeight={800} fontSize={56} fill="#fff" opacity={entre(t, 0.5, 0.8)} fontStyle="italic">
        psst…
      </text>
      <Pessoa x={1250} y={1030} s={1.45} {...LIA} humor="preocupada" olhar={-1} />
    </Cena>
  );
};

/** "E faz você duvidar de si mesmo tão devagar que você nem percebe." */
export const CenaEspelho: React.FC<P> = ({fala}) => {
  const t = useSegundos();
  const d = dur(fala);
  const tDuvidar = momento(fala, 'duvidar');
  const tPercebe = momento(fala, 'nem percebe');
  const nevoa = entre(t, tDuvidar, d, 0, 1);
  return (
    <Cena fundo={cores.ceu} dur={d}>
      <defs>
        <clipPath id="espelho-oval">
          <ellipse cx={960} cy={470} rx={300} ry={390} />
        </clipPath>
        <filter id="desfoque">
          <feGaussianBlur stdDeviation={interpolate(nevoa, [0, 1], [0, 14])} />
        </filter>
      </defs>
      {/* moldura */}
      <ellipse cx={960} cy={470} rx={330} ry={420} fill="#e9a23b" stroke={cores.tinta} strokeWidth={8} />
      <ellipse cx={960} cy={470} rx={300} ry={390} fill="#d8f3ff" />
      <g clipPath="url(#espelho-oval)">
        <g filter="url(#desfoque)" opacity={interpolate(nevoa, [0, 1], [1, 0.35])}>
          <Pessoa x={960} y={1030} s={1.25} {...LIA} humor={t > tPercebe ? 'confusa' : 'neutro'} fasePiscar={20} />
        </g>
        {/* névoa crescendo */}
        {[
          [820, 300],
          [1100, 380],
          [900, 620],
          [1080, 700],
          [960, 480],
        ].map(([x, y], i) => (
          <Nuvem key={i} x={x} y={y} s={1.2 * nevoa} opacidade={0.5 * nevoa} contorno={false} />
        ))}
        <path d="M 760 200 L 860 120" stroke="#fff" strokeWidth={22} strokeLinecap="round" opacity={0.6} />
      </g>
      <g opacity={entre(t, tPercebe, tPercebe + 0.3)}>
        <Interrogacao x={1380} y={330} s={1} />
        <Interrogacao x={520} y={420} s={0.7} />
      </g>
      {/* costas da Lia, em primeiro plano */}
      <g transform="translate(330 1120)">
        <path d="M -230 0 C -230 -220 -150 -290 0 -290 C 150 -290 230 -220 230 0 Z" fill="#23a094" stroke={cores.tinta} strokeWidth={8} />
        <circle cx={0} cy={-420} r={150} fill="#3b2416" stroke={cores.tinta} strokeWidth={8} />
        <circle cx={0} cy={-585} r={65} fill="#3b2416" stroke={cores.tinta} strokeWidth={8} />
      </g>
    </Cena>
  );
};
