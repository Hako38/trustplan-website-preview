(() => {
  const formatCurrency = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0
  });

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const animateValue = (element, target, formatter = (value) => value) => {
    if (!element) return;
    const start = Number(element.dataset.value || 0);
    const end = Number(target);
    const duration = 520;
    const started = performance.now();

    const tick = (now) => {
      const progress = clamp((now - started) / duration, 0, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = start + (end - start) * eased;
      element.textContent = formatter(value);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        element.dataset.value = String(end);
        element.textContent = formatter(end);
      }
    };

    requestAnimationFrame(tick);
  };

  const initHeader = () => {
    const header = document.querySelector("[data-header]");
    const toggle = document.querySelector("[data-nav-toggle]");
    const menu = document.querySelector("[data-nav-menu]");
    if (!header || !toggle || !menu) return;

    const setHeaderState = () => {
      header.classList.toggle("scrolled", window.scrollY > 12);
    };

    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    menu.addEventListener("click", (event) => {
      if (event.target.matches("a")) {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });

    setHeaderState();
    window.addEventListener("scroll", setHeaderState, { passive: true });
  };

  const initReveal = () => {
    const revealItems = document.querySelectorAll(".reveal");
    if (!revealItems.length) return;

    if (!("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    revealItems.forEach((item) => observer.observe(item));
  };

  const initHeadingAnimations = () => {
    const main = document.querySelector("main");
    if (!main) return;
    const legalPage = /\/(impressum|datenschutz|danke|404)\.html$/i.test(window.location.pathname);
    if (legalPage) return;

    const normalize = (text) => text.replace(/\s+/g, " ").trim();
    const splitWords = (text) =>
      normalize(text)
        .split(" ")
        .map((word) => `<span class="title-word">${word}</span>`)
        .join(" ");
    const setAnimatedHTML = (element, html, variant) => {
      if (!element || element.dataset.headingAnimated === "true") return;
      element.dataset.headingAnimated = "true";
      element.classList.add("title-anim", `title-${variant}`);
      element.innerHTML = html;
      element.querySelectorAll(".title-word").forEach((word, index) => {
        word.style.transitionDelay = `${180 + index * 190}ms`;
      });
    };

    const heroTitle = document.querySelector(".hero h1");
    const heroTitleText = normalize(heroTitle?.textContent || "").replace("Strukturstatt", "Struktur statt");
    if (heroTitleText === "Endlich Struktur statt Verlust.") {
      setAnimatedHTML(
        heroTitle,
        '<span class="title-word">Endlich</span> <span class="title-word title-accent title-copper title-type">Struktur</span><br><span class="title-word">statt</span> <span class="title-word title-accent title-neutral title-wipe">Verlust.</span>',
        "hero"
      );
    }

    main.querySelectorAll("h1").forEach((heading) => {
      if (heading.classList.contains("title-anim")) return;
      setAnimatedHTML(heading, splitWords(heading.textContent), "page");
    });

    const strongHeadings = new Map([
      [
        "Wo dein Geld heute verloren geht",
        {
          variant: "blur",
          html: 'Wo dein Geld heute <span class="title-accent title-neutral title-wipe">verloren</span> geht'
        }
      ],
      [
        "Warum die meisten Menschen ohne Plan durchs Leben gehen",
        {
          variant: "words",
          html: '<span class="title-word">Warum</span> <span class="title-word">die</span> <span class="title-word">meisten</span> <span class="title-word">Menschen</span> <span class="title-word title-accent title-neutral title-type">ohne Plan</span> <span class="title-word">durchs</span> <span class="title-word">Leben</span> <span class="title-word">gehen</span>'
        }
      ],
      [
        "Die vier Bereiche, die über deine finanzielle Zukunft entscheiden",
        {
          variant: "mask",
          html: 'Die vier Bereiche, die über deine <span class="title-accent title-neutral title-wipe">finanzielle Zukunft</span> entscheiden'
        }
      ],
      [
        "Was TrustPlan vom Markt unterscheidet",
        {
          variant: "depth",
          html: 'Was <span class="title-accent title-copper">TrustPlan</span> vom Markt unterscheidet'
        }
      ],
      [
        "Für wen Trustplan besonders sinnvoll ist",
        {
          variant: "words",
          html: '<span class="title-word">Für</span> <span class="title-word">wen</span> <span class="title-word">Trustplan</span> <span class="title-word title-accent title-neutral title-wipe">besonders sinnvoll</span> <span class="title-word">ist</span>'
        }
      ],
      [
        "Kostenlose Finanz-Tools für deine erste Orientierung",
        {
          variant: "glass",
          html: 'Kostenlose Finanz-Tools für deine erste <span class="title-accent title-copper title-wipe">Orientierung</span>'
        }
      ],
      [
        "Ergebnisse echter Mandanten",
        {
          variant: "fade",
          html: 'Ergebnisse <span class="title-accent title-neutral title-wipe">echter Mandanten</span>'
        }
      ],
      [
        "Wenn die Struktur steht, beginnt der nächste Schritt",
        {
          variant: "words",
          html: '<span class="title-word">Wenn</span> <span class="title-word">die</span> <span class="title-word title-accent title-copper">Struktur</span> <span class="title-word">steht,</span> <span class="title-word">beginnt</span> <span class="title-word">der</span> <span class="title-word title-accent title-neutral title-wipe">nächste Schritt</span>'
        }
      ],
      [
        "Über uns",
        {
          variant: "glass",
          html: "Über uns"
        }
      ],
      [
        "So läuft die Zusammenarbeit ab",
        {
          variant: "mask",
          html: "So läuft die Zusammenarbeit ab"
        }
      ],
      [
        "Kostenlose Potenzialanalyse starten",
        {
          variant: "growth",
          html: 'Kostenlose <span class="title-accent title-neutral title-wipe">Potenzialanalyse</span> starten'
        }
      ],
      [
        "Häufige Fragen",
        {
          variant: "fade",
          html: "Häufige Fragen"
        }
      ],
      [
        "Warte nicht, bis du jahrelang Potenzial verschenkst",
        {
          variant: "final",
          html: '<span class="title-word">Warte</span> <span class="title-word">nicht,</span> <span class="title-word">bis</span> <span class="title-word">du</span> <span class="title-word">jahrelang</span> <span class="title-word title-accent title-neutral">Potenzial</span> <span class="title-word title-accent title-neutral">verschenkst</span>'
        }
      ]
    ]);

    main.querySelectorAll("h2").forEach((heading) => {
      const config = strongHeadings.get(normalize(heading.textContent));
      if (config) {
        setAnimatedHTML(heading, config.html, config.variant);
      }
    });

    main.querySelectorAll("h2").forEach((heading, index) => {
      if (heading.classList.contains("title-anim")) return;
      setAnimatedHTML(heading, splitWords(heading.textContent), index % 2 === 0 ? "mask" : "blur");
    });

    const animatedHeadings = document.querySelectorAll(".title-anim, .title-standard");
    if (!animatedHeadings.length) return;

    const showHeading = (heading) => {
      heading.classList.add("title-visible");
    };

    const revealVisibleHeadings = () => {
      animatedHeadings.forEach((heading) => {
        if (heading.classList.contains("title-visible")) return;
        const rect = heading.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.88 && rect.bottom > 0) {
          showHeading(heading);
        }
      });
    };

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      animatedHeadings.forEach(showHeading);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            showHeading(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: "0px 0px -4% 0px" }
    );

    animatedHeadings.forEach((heading) => observer.observe(heading));
    requestAnimationFrame(revealVisibleHeadings);
    window.addEventListener("scroll", revealVisibleHeadings, { passive: true });
    window.addEventListener("resize", revealVisibleHeadings, { passive: true });
  };

  const initCounters = () => {
    const counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;

    const runCounter = (counter) => {
      const target = Number(counter.dataset.count || 0);
      animateValue(counter, target, (value) => Math.round(value).toLocaleString("de-DE"));
    };

    if (!("IntersectionObserver" in window)) {
      counters.forEach(runCounter);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.7 }
    );

    counters.forEach((counter) => observer.observe(counter));
  };

  const syncInvestmentInputs = () => {
    document.querySelectorAll("[data-investment-input]").forEach((range) => {
      const key = range.dataset.investmentInput;
      const number = document.querySelector(`[data-investment-number="${key}"]`);
      if (!number) return;

      range.addEventListener("input", () => {
        number.value = range.value;
        updateInvestmentCalculator();
      });

      number.addEventListener("input", () => {
        range.value = number.value;
        updateInvestmentCalculator();
      });
    });
  };

  const getInvestmentValues = () => {
    const read = (key) => Number(document.querySelector(`[data-investment-number="${key}"]`)?.value || 0);
    return {
      monthly: Math.max(0, read("monthly")),
      initial: Math.max(0, read("initial")),
      years: Math.max(1, read("years")),
      annualReturn: Math.max(0, read("return")) / 100
    };
  };

  const calculateInvestment = () => {
    const { monthly, initial, years, annualReturn } = getInvestmentValues();
    const months = Math.round(years * 12);
    const monthlyReturn = Math.pow(1 + annualReturn, 1 / 12) - 1;
    let total = initial;
    const yearly = [{ year: 0, paid: initial, total: initial }];

    for (let month = 1; month <= months; month += 1) {
      total = total * (1 + monthlyReturn) + monthly;
      if (month % 12 === 0 || month === months) {
        const year = Math.min(years, month / 12);
        yearly.push({
          year,
          paid: initial + monthly * month,
          total
        });
      }
    }

    const paid = initial + monthly * months;
    const growth = Math.max(0, total - paid);

    return {
      paid,
      growth,
      total,
      profit: growth,
      yearly
    };
  };

  const drawInvestmentChart = (points) => {
    const canvas = document.getElementById("investmentChart");
    if (!canvas || !points.length) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 720;
    const height = rect.height || 320;
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const padding = { top: 28, right: 22, bottom: 34, left: 48 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const maxValue = Math.max(...points.map((point) => point.total), 1);

    const xFor = (index) => padding.left + (chartWidth * index) / Math.max(points.length - 1, 1);
    const yFor = (value) => padding.top + chartHeight - (value / maxValue) * chartHeight;

    ctx.strokeStyle = "rgba(7, 24, 47, 0.1)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i += 1) {
      const y = padding.top + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    gradient.addColorStop(0, "rgba(214, 166, 79, 0.34)");
    gradient.addColorStop(1, "rgba(214, 166, 79, 0.02)");

    ctx.beginPath();
    points.forEach((point, index) => {
      const x = xFor(index);
      const y = yFor(point.total);
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.beginPath();
    points.forEach((point, index) => {
      const x = xFor(index);
      const y = yFor(point.total);
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = "#d6a64f";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    points.forEach((point, index) => {
      const x = xFor(index);
      const y = yFor(point.paid);
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = "#12345f";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = "#5d6b7c";
    ctx.font = "12px system-ui, sans-serif";
    ctx.fillText("Gesamtvermögen", padding.left, 18);
    ctx.fillStyle = "#102033";
    ctx.fillText("Eingezahlt", padding.left + 120, 18);
  };

  function updateInvestmentCalculator() {
    const result = calculateInvestment();
    const outputs = {
      paid: document.querySelector('[data-investment-output="paid"]'),
      growth: document.querySelector('[data-investment-output="growth"]'),
      total: document.querySelector('[data-investment-output="total"]'),
      profit: document.querySelector('[data-investment-output="profit"]')
    };

    Object.entries(outputs).forEach(([key, element]) => {
      animateValue(element, result[key], (value) => formatCurrency.format(value));
    });

    drawInvestmentChart(result.yearly);
  }

  const initInvestmentCalculator = () => {
    if (!document.querySelector("[data-tool='investment']")) return;
    syncInvestmentInputs();
    updateInvestmentCalculator();
    window.addEventListener("resize", () => drawInvestmentChart(calculateInvestment().yearly), { passive: true });
  };

  const initPkvCalculator = () => {
    const form = document.querySelector("[data-pkv-form]");
    const output = document.querySelector("[data-pkv-output]");
    const scoreValue = document.querySelector("[data-pkv-score]");
    const gauge = document.querySelector("[data-pkv-gauge]");
    const progress = document.querySelector("[data-pkv-progress]");
    const relevance = document.querySelector("[data-pkv-relevance]");
    const eligibility = document.querySelector("[data-pkv-eligibility]");
    const saving = document.querySelector("[data-pkv-saving]");
    const title = document.querySelector("[data-pkv-title]");
    const text = document.querySelector("[data-pkv-text]");
    if (!form || !output || !scoreValue || !gauge || !progress || !relevance || !title || !text) return;

    const update = () => {
      const age = Number(form.querySelector('[data-pkv="age"]')?.value || 0);
      const status = form.querySelector('[data-pkv="status"]')?.value || "";
      const income = Number(form.querySelector('[data-pkv="income"]')?.value || 0);
      let score = 0;

      if (age >= 60) {
        score = 0;
      } else if (age >= 55) {
        score = 15;
      } else if (status === "Angestellt") {
        if (income < 6250) score = 0;
        else if (income >= 7000) score = 100;
        else score = age >= 40 ? 70 : 80;
      } else if (["Selbstständig", "Unternehmer"].includes(status)) {
        score = 30;
      }

      score = clamp(score, 0, 100);
      output.classList.remove("is-low", "is-medium", "is-high");

      if (score <= 35) {
        output.classList.add("is-low");
        relevance.textContent = "PKV-Relevanz: niedrig";
        title.textContent = "PKV aktuell eher prüfen, nicht vorschnell entscheiden";
        text.textContent = "Auf Basis deiner Angaben wirkt eine PKV-Prüfung möglich, aber nicht automatisch naheliegend. Eine individuelle Analyse kann zeigen, ob ein Wechsel langfristig sinnvoll wäre.";
      } else if (score <= 65) {
        output.classList.add("is-medium");
        relevance.textContent = "PKV-Relevanz: mittel";
        title.textContent = "PKV-Analyse könnte sinnvoll sein";
        text.textContent = "Deine Angaben deuten darauf hin, dass eine individuelle PKV-Prüfung sinnvoll sein könnte. Entscheidend sind neben Beitrag auch Leistungen, Familienplanung, Gesundheitsstatus und langfristige Tragfähigkeit.";
      } else {
        output.classList.add("is-high");
        relevance.textContent = "PKV-Relevanz: hoch";
        title.textContent = "Hohe Relevanz für eine PKV-Potenzialanalyse";
        text.textContent = "Deine Angaben sprechen dafür, dass eine professionelle PKV-Analyse besonders relevant sein könnte. Wichtig ist eine langfristige Betrachtung statt nur ein Beitragsvergleich.";
      }

      if (eligibility) {
        eligibility.textContent = status === "Angestellt" && income < 6250 && age < 55
          ? "Bei Angestellten ist ein Wechsel unter 6.250 € Bruttoeinkommen monatlich in der Regel nicht möglich."
          : "";
      }

      if (saving) {
        if (["Selbstständig", "Unternehmer"].includes(status) && age < 55) {
          saving.textContent = "Highlight: Bei Selbstständigen und Unternehmern kann je nach Situation ein mögliches Einsparpotenzial von ca. 9.000-11.000 € pro Jahr bestehen.";
        } else if (status === "Angestellt" && income >= 6250 && age < 55) {
          saving.textContent = "Highlight: Bei Angestellten kann je nach Situation ein mögliches Einsparpotenzial von ca. 3.000-5.000 € pro Jahr bestehen.";
        } else {
          saving.textContent = "Eine genaue Einschätzung ist nur nach individueller Prüfung möglich.";
        }
      }

      gauge.style.setProperty("--pkv-score", String(score));
      progress.style.width = `${score}%`;
      animateValue(scoreValue, score, (value) => Math.round(value).toLocaleString("de-DE"));
    };

    form.addEventListener("input", update);
    update();
  };

  const initXrayTool = () => {
    const form = document.querySelector("[data-xray-form]");
    const questions = document.querySelectorAll("[data-xray-question]");
    const light = document.querySelector("[data-xray-light]");
    const title = document.querySelector("[data-xray-title]");
    const text = document.querySelector("[data-xray-text]");
    const result = document.querySelector("[data-xray-result]");
    if (!form || !questions.length || !light || !title || !text || !result) return;

    const update = () => {
      const checked = [...questions].filter((input) => input.checked && input.value === "yes").length;
      light.classList.remove("red", "yellow", "green");
      result.classList.remove("is-red", "is-yellow", "is-green");

      if (checked <= 2) {
        light.classList.add("red");
        result.classList.add("is-red");
        title.textContent = "🔴 Hoher Optimierungsbedarf";
        text.textContent = "Aktuell wirkt deine Struktur lückenhaft. Eine Potenzialanalyse kann helfen, Klarheit in Steuern, Versicherungen, Vorsorge und Investments zu schaffen.";
      } else if (checked <= 4) {
        light.classList.add("yellow");
        result.classList.add("is-yellow");
        title.textContent = "🟡 Teilweise optimiert";
        text.textContent = "Einige Bereiche sind bereits vorhanden. Gleichzeitig könnten weitere Potenziale bestehen.";
      } else {
        light.classList.add("green");
        result.classList.add("is-green");
        title.textContent = "🟢 Gut aufgestellt";
        text.textContent = "Viele Grundlagen sind vorhanden. Eine individuelle Analyse kann zusätzliche Optimierungsmöglichkeiten aufzeigen.";
      }
    };

    form.addEventListener("change", update);
    update();
  };

  const setModal = (modal, isOpen) => {
    if (!modal) return;
    modal.setAttribute("aria-hidden", String(!isOpen));
    document.body.classList.toggle("modal-open", isOpen);
  };

  const initVideoModal = () => {
    const modal = document.querySelector("[data-video-modal]");
    const video = document.querySelector("[data-modal-video]");
    const source = video?.querySelector("source");
    if (!modal || !video || !source) return;

    document.querySelectorAll("[data-video]").forEach((button) => {
      button.addEventListener("click", () => {
        source.src = button.dataset.video || "";
        video.load();
        setModal(modal, true);
      });
    });

    modal.querySelectorAll("[data-modal-close]").forEach((button) => {
      button.addEventListener("click", () => {
        video.pause();
        source.src = "";
        video.load();
        setModal(modal, false);
      });
    });
  };

  const initCompass = () => {
    const compass = document.querySelector(".compass");
    if (!compass) return;

    const cards = [...compass.querySelectorAll(".compass-card")];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compact = window.matchMedia("(max-width: 1023px), (pointer: coarse)");
    let frame = 0;
    let visible = false;
    let pointerX = 0;
    let pointerY = 0;
    let scrollOffset = 0;
    let currentX = 0;
    let currentY = 0;

    const updateScrollOffset = () => {
      const rect = compass.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const compassCenter = rect.top + rect.height / 2;
      scrollOffset = clamp((viewportCenter - compassCenter) / window.innerHeight, -0.5, 0.5);
    };

    const render = (time) => {
      if (!visible || reducedMotion.matches) {
        frame = 0;
        return;
      }

      const seconds = time / 1000;
      const autoX = Math.sin(seconds * 0.42) * (compact.matches ? 0.7 : 0.7);
      const autoY = Math.cos(seconds * 0.36) * (compact.matches ? 0.8 : 0.8);
      const targetX = compact.matches ? autoX : pointerX * 5.5 + autoX;
      const targetY = compact.matches ? autoY : pointerY * 6.5 + autoY;
      currentX += (targetX - currentX) * 0.055;
      currentY += (targetY - currentY) * 0.055;

      compass.style.setProperty("--compass-tilt-x", `${-currentY}deg`);
      compass.style.setProperty("--compass-tilt-y", `${currentX}deg`);
      compass.style.setProperty("--compass-lift", `${scrollOffset * (compact.matches ? -5 : -16)}px`);
      compass.style.setProperty("--needle-angle", `${-18 + Math.sin(seconds * 0.48) * 9 + currentX * 0.7}deg`);

      cards.forEach((card, index) => {
        if (compact.matches) {
          card.style.setProperty("--card-x", "0px");
          card.style.setProperty("--card-y", "0px");
          return;
        }
        const horizontal = index === 1 ? 1 : index === 3 ? -1 : 0;
        const vertical = index === 0 ? -1 : index === 2 ? 1 : 0;
        card.style.setProperty("--card-x", `${currentX * horizontal * 2.2}px`);
        card.style.setProperty("--card-y", `${currentY * vertical * 2.2 + scrollOffset * (index % 2 ? 5 : -5)}px`);
      });

      frame = requestAnimationFrame(render);
    };

    const start = () => {
      if (!frame && !reducedMotion.matches) frame = requestAnimationFrame(render);
    };

    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    };

    compass.addEventListener("pointermove", (event) => {
      if (compact.matches || reducedMotion.matches) return;
      const rect = compass.getBoundingClientRect();
      pointerX = clamp((event.clientX - rect.left) / rect.width - 0.5, -0.5, 0.5);
      pointerY = clamp((event.clientY - rect.top) / rect.height - 0.5, -0.5, 0.5);
    }, { passive: true });

    compass.addEventListener("pointerleave", () => {
      pointerX = 0;
      pointerY = 0;
    }, { passive: true });

    window.addEventListener("scroll", updateScrollOffset, { passive: true });
    reducedMotion.addEventListener("change", () => {
      if (reducedMotion.matches) {
        stop();
        compass.removeAttribute("style");
        cards.forEach((card) => card.removeAttribute("style"));
      } else if (visible) {
        start();
      }
    });

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updateScrollOffset();
      if (visible) start();
      else stop();
    }, { rootMargin: "120px 0px", threshold: 0.05 });

    observer.observe(compass);
    updateScrollOffset();
  };

  const initFunnel = () => {
    const form = document.querySelector("[data-funnel]");
    if (!form) return;

    const steps = [...form.querySelectorAll("[data-step]")];
    const progress = form.querySelector("[data-funnel-progress]");
    const prev = form.querySelector("[data-funnel-prev]");
    const next = form.querySelector("[data-funnel-next]");
    const submit = form.querySelector("[data-funnel-submit]");
    let current = 0;

    const showStep = () => {
      steps.forEach((step, index) => step.classList.toggle("active", index === current));
      if (progress) progress.style.width = `${((current + 1) / steps.length) * 100}%`;
      if (prev) prev.style.visibility = current === 0 ? "hidden" : "visible";
      if (next) next.classList.toggle("hidden", current === steps.length - 1);
      if (submit) submit.classList.toggle("hidden", current !== steps.length - 1);
    };

    const isCurrentStepValid = () => {
      const step = steps[current];
      const radios = [...step.querySelectorAll('input[type="radio"]')];
      const checkboxes = [...step.querySelectorAll('input[type="checkbox"]')];
      const fields = [...step.querySelectorAll("input:not([type='radio']):not([type='checkbox'])")];

      if (radios.length) {
        const names = [...new Set(radios.map((radio) => radio.name))];
        const invalidName = names.find((name) => !step.querySelector(`input[name="${name}"]:checked`));
        if (invalidName) {
          step.querySelector(`input[name="${invalidName}"]`)?.focus();
          return false;
        }
      }

      if (checkboxes.length && current === 3 && !checkboxes.some((checkbox) => checkbox.checked)) {
        checkboxes[0].focus();
        return false;
      }

      return fields.every((field) => field.reportValidity());
    };

    prev?.addEventListener("click", () => {
      current = Math.max(0, current - 1);
      showStep();
    });

    next?.addEventListener("click", () => {
      if (!isCurrentStepValid()) return;
      current = Math.min(steps.length - 1, current + 1);
      showStep();
    });

    form.addEventListener("submit", (event) => {
      if (!isCurrentStepValid()) event.preventDefault();
    });

    showStep();
  };

  const initLeakToggle = () => {
    const toggle = document.querySelector("[data-leak-toggle]");
    const system = document.querySelector("[data-leak-system]");
    if (!toggle || !system) return;

    const section = system.closest(".leak-section");
    const setState = (isAfter) => {
      toggle.setAttribute("aria-pressed", String(isAfter));
      system.classList.toggle("is-after", isAfter);
      section?.classList.toggle("leak-after", isAfter);
    };

    toggle.addEventListener("click", () => {
      setState(toggle.getAttribute("aria-pressed") !== "true");
    });

    setState(false);
  };

  const initDecisionCards = () => {
    const cards = document.querySelectorAll(".decision-section .solid-card");
    if (!cards.length) return;

    cards.forEach((card, index) => {
      card.style.setProperty("--decision-index", index);
      card.setAttribute("tabindex", "0");
    });

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      cards.forEach((card) => card.classList.add("is-active"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-active", entry.isIntersecting);
        });
      },
      { threshold: 0.42, rootMargin: "-12% 0px -18% 0px" }
    );

    cards.forEach((card) => observer.observe(card));
  };

  const initRealEstateVisual = () => {
    const visual = document.querySelector("[data-real-estate-visual]");
    if (!visual || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;
    const update = () => {
      const rect = visual.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const progress = clamp((viewport - rect.top) / (viewport + rect.height), 0, 1);
      const shift = (progress - 0.5) * 2;
      visual.style.setProperty("--estate-shift", shift.toFixed(3));
      ticking = false;
    };

    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
  };

  const initImageFallbacks = () => {
    document.querySelectorAll("img").forEach((image) => {
      image.addEventListener("error", () => {
        image.style.opacity = "0";
      });
    });
  };

  const initEscapeToClose = () => {
    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      document.querySelectorAll(".modal").forEach((modal) => {
        if (modal.getAttribute("aria-hidden") === "false") {
          setModal(modal, false);
          const video = modal.querySelector("video");
          if (video) video.pause();
        }
      });
    });
  };

  document.addEventListener("DOMContentLoaded", () => {
    initHeader();
    initHeadingAnimations();
    initReveal();
    initCounters();
    initInvestmentCalculator();
    initPkvCalculator();
    initXrayTool();
    initVideoModal();
    initCompass();
    initFunnel();
    initLeakToggle();
    initDecisionCards();
    initRealEstateVisual();
    initImageFallbacks();
    initEscapeToClose();
  });
})();
