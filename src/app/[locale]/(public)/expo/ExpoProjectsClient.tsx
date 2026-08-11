"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./expo-projects.module.css";

type Stat = {
  num: string;
  label: string;
};

type Area = {
  name: string;
  desc: string;
  photos: string[];
};

type Typology = {
  name: string;
  desc: string;
  planImage: string;
  rooms: string;
  m2: string;
  price: string;
  cochera: boolean;
};

type Person = {
  name: string;
  role: string;
  bio: string;
};

type Advisor = Person & {
  phone: string;
  email: string;
};

type Project = {
  id: string;
  name: string;
  location: string;
  locationLink: string;
  tagline: string;
  overview: string;
  stats: Stat[];
  areas: Area[];
  typologies: Typology[];
  cochera: {
    price: string;
    m2: string;
  };
  financingUrl: string;
  developer: Person;
  constructor: Person;
  advisor: Advisor;
};

export type ExpoProjectsData = {
  areaCatalog: string[];
  projects: Project[];
};

type TourSlide = {
  area: Area;
  areaIndex: number;
  photo: string | null;
};

const TOUR_SLIDE_MS = 4500;

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function buildTourSlides(project: Project): TourSlide[] {
  return project.areas.flatMap((area, areaIndex) => {
    const photos = area.photos.length > 0 ? area.photos.slice(0, 4) : [null];
    return photos.map((photo) => ({ area, areaIndex, photo }));
  });
}

function phoneHref(phone: string) {
  return `tel:${phone.replace(/\s/g, "")}`;
}

export function ExpoProjectsClient({ data }: { data: ExpoProjectsData }) {
  const [currentProjectId, setCurrentProjectId] = useState(
    data.projects[0]?.id ?? "",
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const [tourPaused, setTourPaused] = useState(false);
  const [formStatus, setFormStatus] = useState<{
    kind: "idle" | "loading" | "ok" | "err";
    text: string;
  }>({ kind: "idle", text: "" });

  const heroRef = useRef<HTMLElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);

  const project =
    data.projects.find((item) => item.id === currentProjectId) ??
    data.projects[0];

  const tourSlides = useMemo(() => buildTourSlides(project), [project]);
  const currentSlide = tourSlides[tourIndex] ?? tourSlides[0];

  const selectProject = useCallback((id: string) => {
    setCurrentProjectId(id);
    setMobileOpen(false);
    setTourOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const scrollToForm = useCallback(() => {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => nameInputRef.current?.focus(), 400);
  }, []);

  const closeTour = useCallback(() => {
    setTourOpen(false);
    setTourPaused(false);
  }, []);

  const nextTourSlide = useCallback(() => {
    setTourIndex((index) => {
      if (index + 1 >= tourSlides.length) {
        window.setTimeout(closeTour, 0);
        return index;
      }
      return index + 1;
    });
  }, [closeTour, tourSlides.length]);

  const prevTourSlide = useCallback(() => {
    setTourIndex((index) => Math.max(0, index - 1));
  }, []);

  const openTour = useCallback(() => {
    if (!tourSlides.length) return;
    setTourIndex(0);
    setTourPaused(false);
    setTourOpen(true);
  }, [tourSlides.length]);

  useEffect(() => {
    const hero = heroRef.current;
    const form = formRef.current;
    let heroPassed = false;
    let formVisible = false;

    const updateVisibility = () => {
      setStickyVisible(heroPassed && !formVisible);
    };

    const heroObserver = hero
      ? new IntersectionObserver(
          (entries) => {
            heroPassed = entries.some((entry) => !entry.isIntersecting);
            updateVisibility();
          },
          { threshold: 0 },
        )
      : null;

    const formObserver = form
      ? new IntersectionObserver(
          (entries) => {
            formVisible = entries.some((entry) => entry.isIntersecting);
            updateVisibility();
          },
          { threshold: 0.2 },
        )
      : null;

    if (hero) heroObserver?.observe(hero);
    if (form) formObserver?.observe(form);

    return () => {
      heroObserver?.disconnect();
      formObserver?.disconnect();
    };
  }, [project.id]);

  useEffect(() => {
    if (!tourOpen || tourPaused) return;
    const timer = window.setTimeout(nextTourSlide, TOUR_SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [nextTourSlide, tourOpen, tourIndex, tourPaused]);

  useEffect(() => {
    setFormStatus({ kind: "idle", text: "" });
  }, [project.id]);

  useEffect(() => {
    document.body.classList.toggle(styles.tourLock, tourOpen);
    return () => document.body.classList.remove(styles.tourLock);
  }, [tourOpen]);

  useEffect(() => {
    if (!tourOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeTour();
      if (event.key === "ArrowRight") nextTourSlide();
      if (event.key === "ArrowLeft") prevTourSlide();
      if (event.key === " ") {
        event.preventDefault();
        setTourPaused((value) => !value);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [closeTour, nextTourSlide, prevTourSlide, tourOpen]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get("name") ?? "").trim();
    const whatsapp = String(formData.get("phone") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    setFormStatus({ kind: "loading", text: "Enviando..." });

    try {
      const response = await fetch("/api/public/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          whatsapp,
          sourcePage: "/expo-proyectos",
          notes: `${message}\n\nProyecto: ${project.name}`,
        }),
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      setFormStatus({
        kind: "ok",
        text: "Gracias. Tu consulta fue enviada, te contactaremos a la brevedad.",
      });
      event.currentTarget.reset();
    } catch (error) {
      console.error(error);
      setFormStatus({
        kind: "err",
        text: "No pudimos enviar tu consulta. Proba nuevamente en unos minutos.",
      });
    }
  };

  if (!project) {
    return null;
  }

  return (
    <div className={styles.page}>
      <div className={styles.brandbar}>
        <div className={cx(styles.wrap, styles.brandbarInner)}>
          {/* <div className={styles.brand}>
            Investments<span>Paraguay</span>
          </div> */}
          <nav className={styles.projectSwitch} aria-label="Proyectos">
            {data.projects.map((item) => (
              <button
                key={item.id}
                type="button"
                className={item.id === project.id ? styles.active : undefined}
                onClick={() => selectProject(item.id)}
              >
                {item.name}
              </button>
            ))}
          </nav>
          <button
            className={cx(styles.burger, mobileOpen && styles.open)}
            type="button"
            aria-label="Abrir menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((value) => !value)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
        <div className={cx(styles.mobilePanel, mobileOpen && styles.open)}>
          <div className={styles.mobilePanelInner}>
            {data.projects.map((item) => (
              <button
                key={item.id}
                type="button"
                className={cx(
                  styles.mobileProject,
                  item.id === project.id && styles.active,
                )}
                onClick={() => selectProject(item.id)}
              >
                {item.name}
              </button>
            ))}
            <button
              className={styles.mobileCta}
              type="button"
              onClick={scrollToForm}
            >
              Solicitar informacion
            </button>
          </div>
        </div>
      </div>

      <section className={styles.hero} ref={heroRef}>
        <div className={cx(styles.wrap, styles.heroInner)}>
          {/* <div className={styles.eyebrow}>
            Proyecto destacado · InvestmentsParaguay
          </div> */}
          <h1>
            {project.name}
            <br />
            <em className="text-2xl">{project.tagline}</em>
          </h1>
          <div className={styles.heroLoc}>
            <a
              href={project.locationLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {project.location}
            </a>
          </div>
          <div className={styles.heroPitch}>{project.overview}</div>
          <div className={styles.heroActions}>
            <button
              className={cx(styles.btn, styles.tourLaunch)}
              type="button"
              onClick={openTour}
            >
              <span className={styles.tourLaunchIcon} />
              Iniciar recorrido virtual
            </button>
            <button
              className={cx(styles.btn, styles.btnGhostLight)}
              type="button"
              onClick={scrollToForm}
            >
              Solicitar informacion
            </button>
          </div>
          <div className={styles.statRow}>
            {project.stats.map((stat) => (
              <div className={styles.stat} key={`${stat.num}-${stat.label}`}>
                <div className={styles.statNum}>{stat.num}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.block}>
        <div className={styles.wrap}>
          <div className={styles.surveyDivider}>espacios del proyecto</div>
          <div className={styles.blockHead}>
            <div className={styles.blockTitle}>Conoce cada ambiente</div>
            <div className={styles.blockSub}>
              {project.areas.length} areas relevadas
            </div>
          </div>
          <div className={styles.areasGrid}>
            {project.areas.map((area, index) => (
              <div className={styles.areaCard} key={area.name}>
                <div className={styles.areaPhotos}>
                  {[0, 1, 2, 3].map((photoIndex) => {
                    const photo = area.photos[photoIndex];
                    return (
                      <div
                        className={styles.areaPhoto}
                        key={`${area.name}-${photoIndex}`}
                      >
                        {photo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={photo}
                            alt={area.name}
                            loading="lazy"
                            decoding="async"
                            width={300}
                            height={150}
                          />
                        ) : (
                          "Foto pendiente"
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className={styles.areaNum}>
                  {String(index + 1).padStart(2, "0")} / AREA
                </div>
                <div className={styles.areaName}>{area.name}</div>
                <div className={styles.areaDesc}>{area.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={cx(styles.block, styles.alt)}>
        <div className={styles.wrap}>
          <div className={styles.blockHead}>
            <div className={styles.blockTitle}>Tipologias disponibles</div>
            <div className={styles.blockSub}>Hasta 4 por proyecto</div>
          </div>
          <div className={styles.typoGrid}>
            {project.typologies.map((typology) => (
              <div className={styles.typoCard} key={typology.name}>
                <div className={styles.typoPlan}>
                  {typology.planImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={typology.planImage}
                      alt={`Plano ${typology.name}`}
                      loading="lazy"
                      decoding="async"
                      width={400}
                      height={300}
                    />
                  ) : (
                    "Plano pendiente"
                  )}
                </div>
                <div className={styles.typoBody}>
                  <div className={styles.typoName}>{typology.name}</div>
                  <div className={styles.typoDesc}>{typology.desc}</div>
                  <div className={styles.typoSpecs}>
                    <span>
                      <b>{typology.rooms}</b>Ambientes
                    </span>
                    <span>
                      <b>{typology.m2}</b>Superficie
                    </span>
                  </div>
                  <div className={styles.typoPriceRow}>
                    <div className={styles.typoPrice}>{typology.price}</div>
                    <div
                      className={cx(
                        styles.cocheraTag,
                        typology.cochera ? styles.cocheraYes : styles.cocheraNo,
                      )}
                    >
                      {typology.cochera ? "Con cochera" : "Sin cochera"}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.block}>
        <div className={styles.wrap}>
          <div className={styles.twoCol}>
            <div className={styles.infoCard}>
              <h3>Cochera</h3>
              <div className={styles.priceBig}>{project.cochera.price}</div>
              <div className={styles.m2Tag}>{project.cochera.m2}</div>
            </div>
            <div className={styles.infoCard}>
              <h3>Plan de financiación</h3>
              <p>
                Descarga o revisa el detalle de cuotas, plazos y condiciones en
                la planilla oficial del proyecto.
              </p>
              <div className="text-ivory">
                <a
                  className={styles.btn}
                  href={project.financingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver planilla de financiacion
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={cx(styles.block, styles.alt)}>
        <div className={styles.wrap}>
          <div className={styles.blockHead}>
            <div className={styles.blockTitle}>Quiénes están detrás</div>
          </div>
          <div className={styles.peopleGrid}>
            {[project.developer, project.constructor].map((person) => (
              <div className={styles.peopleCard} key={person.name}>
                <div className={styles.avatar}>{initials(person.name)}</div>
                <div>
                  <div className={styles.peopleRole}>{person.role}</div>
                  <div className={styles.peopleName}>{person.name}</div>
                  <div className={styles.peopleBio}>{person.bio}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.block}>
        <div className={styles.wrap}>
          <div className={styles.advisorCard}>
            <div className={styles.advisorAvatar}>
              {initials(project.advisor.name)}
            </div>
            <div>
              <div className={styles.advisorRole}>{project.advisor.role}</div>
              <div className={styles.advisorName}>{project.advisor.name}</div>
              <div className={styles.advisorBio}>{project.advisor.bio}</div>
              <div className={styles.advisorContacts}>
                <a
                  className={styles.chip}
                  href={phoneHref(project.advisor.phone)}
                >
                  {project.advisor.phone}
                </a>
                <a
                  className={styles.chip}
                  href={`mailto:${project.advisor.email}`}
                >
                  {project.advisor.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={cx(styles.block, styles.alt, styles.lastBlock)}>
        <div className={styles.wrap}>
          <div className={styles.blockHead}>
            <div className={styles.blockTitle}>Quiero mas informacion</div>
          </div>
          <form
            key={project.id}
            className={styles.formShell}
            ref={formRef}
            onSubmit={onSubmit}
          >
            <div className={styles.field}>
              <label htmlFor="f_name">Nombre completo</label>
              <input
                type="text"
                id="f_name"
                name="name"
                ref={nameInputRef}
                required
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="f_phone">Numero de telefono</label>
              <input type="tel" id="f_phone" name="phone" required />
            </div>
            <div className={styles.field}>
              <label htmlFor="f_email">Correo electronico</label>
              <input type="email" id="f_email" name="email" required />
            </div>
            <div className={styles.field}>
              <label htmlFor="f_message">Mensaje</label>
              <textarea
                id="f_message"
                name="message"
                defaultValue={`Estoy interesado en la propiedad "${project.name}"`}
              />
            </div>
            <button type="submit" className={styles.btn}>
              Enviar consulta
            </button>
            <div className={styles.formNote}>
              Tus datos se guardan como lead para seguimiento del equipo
              comercial.
            </div>
            {formStatus.text ? (
              <div
                className={cx(
                  styles.formStatus,
                  formStatus.kind === "ok" && styles.ok,
                  formStatus.kind === "err" && styles.err,
                )}
              >
                {formStatus.text}
              </div>
            ) : null}
          </form>
        </div>
      </section>

      <button
        type="button"
        className={cx(styles.stickyCta, stickyVisible && styles.show)}
        onClick={scrollToForm}
      >
        <span className={styles.dot} /> Solicitar informacion
      </button>

      <div
        className={cx(styles.tourOverlay, tourOpen && styles.open)}
        aria-hidden={!tourOpen}
        role="dialog"
        aria-label="Recorrido virtual"
      >
        <div className={styles.tourProgress}>
          {tourSlides.map((slide, index) => (
            <div className={styles.tourSeg} key={`${slide.area.name}-${index}`}>
              <div
                className={cx(
                  styles.tourSegFill,
                  index < tourIndex && styles.complete,
                  index === tourIndex && !tourPaused && styles.animating,
                )}
                style={
                  index === tourIndex && !tourPaused
                    ? { animationDuration: `${TOUR_SLIDE_MS}ms` }
                    : undefined
                }
              />
            </div>
          ))}
        </div>
        <div className={styles.tourTopbar}>
          <div className={styles.tourTitle}>
            {project.name} · Recorrido virtual
          </div>
          <div className={styles.tourActions}>
            <button
              className={styles.tourIconBtn}
              type="button"
              aria-label={
                tourPaused ? "Reanudar recorrido" : "Pausar recorrido"
              }
              onClick={() => setTourPaused((value) => !value)}
            >
              {tourPaused ? ">" : "||"}
            </button>
            <button
              className={styles.tourIconBtn}
              type="button"
              aria-label="Cerrar recorrido"
              onClick={closeTour}
            >
              x
            </button>
          </div>
        </div>
        <div className={styles.tourStage}>
          <div className={styles.tourImgWrap}>
            {currentSlide?.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className={cx(styles.tourImg, styles.visible, styles.kenburns)}
                src={currentSlide.photo}
                alt={currentSlide.area.name}
              />
            ) : (
              <div className={styles.tourPlaceholderLabel}>
                Foto de &quot;{currentSlide?.area.name}&quot; pendiente de carga
              </div>
            )}
          </div>
          <button
            className={cx(styles.tourTap, styles.tourTapLeft)}
            type="button"
            aria-label="Area anterior"
            onClick={prevTourSlide}
          />
          <button
            className={cx(styles.tourTap, styles.tourTapRight)}
            type="button"
            aria-label="Area siguiente"
            onClick={nextTourSlide}
          />
          <button
            className={cx(styles.tourArrow, styles.tourArrowLeft)}
            type="button"
            aria-label="Area anterior"
            onClick={prevTourSlide}
          >
            ‹
          </button>
          <button
            className={cx(styles.tourArrow, styles.tourArrowRight)}
            type="button"
            aria-label="Area siguiente"
            onClick={nextTourSlide}
          >
            ›
          </button>
          <div className={styles.tourCaption}>
            <div className={styles.tourAreaName}>{currentSlide?.area.name}</div>
            <div className={styles.tourAreaDesc}>{currentSlide?.area.desc}</div>
            <div className={styles.tourCounter}>
              Area {(currentSlide?.areaIndex ?? 0) + 1} de{" "}
              {project.areas.length} · Foto {tourIndex + 1} de{" "}
              {tourSlides.length}
            </div>
          </div>
        </div>
      </div>

      {/* <footer className={styles.footer}>
        InvestmentsParaguay · Pantalla premium de proyectos
      </footer> */}
    </div>
  );
}
