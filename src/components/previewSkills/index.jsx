import { useState } from "react";
import "./PreviewSkills.css";

const skillTypes = {
  1: "Q",
  2: "W",
  3: "E",
  4: "ULTIMATE",
  default: "PASSIVE",
};

const compactValue = (value) => {
  if (!value || value === "0" || value === "0/0/0/0/0") {
    return "None";
  }

  return value;
};

const hasProgression = (values = []) =>
  values.length > 1 && new Set(values).size > 1;

const AbilityProgression = ({ label, values, suffix = "" }) => {
  if (!hasProgression(values)) {
    return null;
  }

  return (
    <div className="ability-progression">
      <div className="ability-progression__heading">
        <span>{label}</span>
        <small>By ability rank</small>
      </div>
      <div
        className="ability-progression__values"
        style={{ "--value-count": values.length }}
      >
        {values.map((value, index) => (
          <div key={`${label}-${index}`}>
            <span>{index + 1}</span>
            <strong>
              {value}
              {suffix}
            </strong>
          </div>
        ))}
      </div>
    </div>
  );
};

const PreviewSkills = ({ skils }) => {
  const [typeSkill, setTypeSkill] = useState(0);
  const activeSkill = skils[typeSkill];
  const cooldown = compactValue(activeSkill.cooldown);

  return (
    <div className="container abilities__inner">
      <div className="abilities__copy">
        <span className="abilities__eyebrow">Master the kit</span>
        <h2 className="preview__title">Abilities</h2>
        <p className="abilities__intro">
          Learn the tools that define this champion and turn every cast into an
          advantage.
        </p>

        <ul className="preview__list">
          {skils.map((item, index) => (
            <li className="preview__button" key={item.name}>
              <button
                className={
                  index === typeSkill
                    ? "preview__img active-skils"
                    : "preview__img"
                }
                onClick={() => setTypeSkill(index)}
                aria-label={`Show ${item.name}`}
                aria-pressed={index === typeSkill}
              >
                <img src={item.img} alt="" />
                <span>{skillTypes[index] || skillTypes.default}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="abilities__desc">
          <span>{skillTypes[typeSkill] || skillTypes.default}</span>
          <h3 className="abilities__name">{activeSkill.name}</h3>
          <p>{activeSkill.description}</p>
        </div>

        {!activeSkill.isPassive && (
          <div className="ability-progressions">
            <AbilityProgression
              label="Cooldown"
              values={activeSkill.cooldownValues}
              suffix="s"
            />
            <AbilityProgression
              label={activeSkill.resourceName}
              values={activeSkill.costValues}
            />
          </div>
        )}
      </div>

      <div className="ability-dossier">
        <span className="ability-dossier__label">Ability data</span>
        <div className="abilities__media-glow" />
        <div className="ability-dossier__identity">
          <img src={activeSkill.img} alt="" />
          <div>
            <small>{skillTypes[typeSkill] || skillTypes.default}</small>
            <span>{activeSkill.name}</span>
          </div>
        </div>

        {activeSkill.isPassive ? (
          <div className="ability-dossier__passive">
            <strong>Innate ability</strong>
            <p>
              Passive abilities are always available and do not require an
              ability rank.
            </p>
          </div>
        ) : (
          <dl className="ability-metrics">
            <div>
              <dt>Cooldown</dt>
              <dd>{cooldown === "None" ? cooldown : `${cooldown}s`}</dd>
            </div>
            <div>
              <dt>{activeSkill.resourceName} cost</dt>
              <dd>{compactValue(activeSkill.cost)}</dd>
            </div>
            <div>
              <dt>Cast range</dt>
              <dd>{compactValue(activeSkill.range)}</dd>
            </div>
            <div>
              <dt>Maximum rank</dt>
              <dd>{activeSkill.maxRank}</dd>
            </div>
          </dl>
        )}

        <div className="ability-dossier__note">
          <span>Reading the numbers</span>
          <p>
            Values separated by slashes show how the ability changes from its
            first rank to its maximum rank.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PreviewSkills;
