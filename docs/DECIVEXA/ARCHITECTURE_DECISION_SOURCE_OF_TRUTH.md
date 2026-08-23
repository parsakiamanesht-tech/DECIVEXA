# DECIVEXA — Architecture Decision Source of Truth

**Product:** DECIVEXA  
**Architecture / Philosophy:** Decision OS  
**Status:** GOVERNANCE RULE  
**Purpose:** جلوگیری از architectural drift، تصمیم‌های متناقض، اتکا به حافظه گفتگو و تأیید غیرانتقادی پیشنهادها.

---

## 1. CORE GOVERNANCE DECISION

DECIVEXA نباید برای حفظ تصمیم‌های معماری، Product، Governance یا Implementation صرفاً به حافظه گفتگو، حافظه مدل یا برداشت افراد/Agentها متکی باشد.

**GitHub Repository Documentation is the authoritative project source of truth.**

Memory and conversation context may assist reasoning, but they do not override the authoritative project documents.

اگر یک تصمیم مهم در Source of Truth ثبت نشده باشد، نباید آن تصمیم را بدون بررسی مجدد به‌عنوان تصمیم رسمی و قطعی DECIVEXA فرض کرد.

---

## 2. WHY THIS RULE EXISTS

DECIVEXA یک پروژه بلندمدت و معماری‌محور است. تصمیم‌های آن ممکن است در طول هفته‌ها، ماه‌ها و Phaseهای متعدد ادامه پیدا کنند.

اتکا به حافظه گفتگو می‌تواند باعث شود:

```text
Decision A
   ↓
Context changes
   ↓
Decision B
   ↓
Contradiction
   ↓
Architectural confusion
```

بنابراین تصمیم‌های مهم باید خارج از حافظه موقت گفتگو، در Repository ثبت شوند.

---

## 3. SOURCE-OF-TRUTH HIERARCHY

برای تصمیم‌های پروژه، ترتیب اتکا باید به‌صورت زیر باشد:

```text
Authoritative Repository Documents
            ↓
Accepted Architecture / Governance Decisions
            ↓
Verified Repository State
            ↓
Current Implementation Evidence
            ↓
Conversation Context / Model Memory
            ↓
Assumption
```

هرچه در این زنجیره پایین‌تر قرار دارد، برای اثبات وضعیت پروژه ضعیف‌تر است.

**Conversation memory must never silently override repository evidence.**

---

## 4. REQUIRED AUTHORITATIVE DOCUMENTATION

تا حد امکان، تصمیم‌های کلیدی DECIVEXA باید در اسناد مشخص و قابل ارجاع نگهداری شوند، از جمله:

```text
MASTER_ROADMAP.md
ARCHITECTURE_CONSTITUTION.md
FOUNDER_DECISIONS.md
ARCHITECTURE_DECISIONS.md
CURRENT_STATE.md
PHASE_STATUS.md
ARCHITECTURE_BACKLOG.md
```

نام دقیق فایل‌ها می‌تواند با ساختار Repository تکامل پیدا کند، اما مفهوم Source of Truth نباید حذف شود.

---

## 5. DECISION CHALLENGE PROTOCOL

هیچ پیشنهاد معماری مهمی نباید صرفاً به دلیل اینکه Founder آن را مطرح کرده است، خودکار تأیید شود.

Founder تصمیم نهایی را می‌گیرد؛ اما قبل از تصمیم نهایی، پیشنهاد باید به‌صورت مستقل بررسی و به چالش کشیده شود.

فرآیند استاندارد:

```text
FOUNDER PROPOSAL
        ↓
INDEPENDENT ANALYSIS
        ↓
EVIDENCE
        ↓
BENEFITS
        ↓
RISKS
        ↓
CONTRADICTIONS
        ↓
ALTERNATIVES
        ↓
ARCHITECTURAL IMPACT
        ↓
DEPENDENCY IMPACT
        ↓
RECOMMENDATION
        ↓
FOUNDER DECISION
        ↓
DOCUMENTED DECISION
```

---

## 6. ANTI-YES-MAN RULE

برای DECIVEXA، تأیید صرفِ پیشنهاد Founder قابل قبول نیست.

اگر تحلیل نشان دهد یک پیشنهاد:

- با Architecture Constitution ناسازگار است؛
- با Roadmap تعارض دارد؛
- Dependencyهای لازم را ندارد؛
- باعث Architectural Drift می‌شود؛
- زودتر از زمان مناسب وارد Core می‌شود؛
- یا راه‌حل بهتری دارد؛

باید این موضوع صریحاً اعلام شود.

**The assistant must challenge a proposal when evidence or architecture indicates that the proposal is unsafe, premature, contradictory, or inferior.**

هدف مخالفت نیست؛ هدف رسیدن به تصمیم قابل دفاع است.

---

## 7. EVIDENCE / INTERPRETATION / RECOMMENDATION SEPARATION

در تحلیل DECIVEXA باید این سه مورد از هم جدا باشند:

```text
EVIDENCE
What is actually verified?

INTERPRETATION
What does the evidence mean?

RECOMMENDATION
What should we do based on it?
```

نباید Recommendation به‌عنوان Fact ارائه شود.

نباید Assumption به‌عنوان Evidence ارائه شود.

نباید تصمیم قبلی صرفاً به دلیل قدیمی بودن، حقیقت تلقی شود.

---

## 8. CONFLICT DETECTION RULE

هر تصمیم جدید باید قبل از ثبت با تصمیم‌ها و وضعیت فعلی بررسی شود.

```text
CURRENT AUTHORITATIVE STATE
        ↓
PREVIOUS DECISIONS
        ↓
CURRENT PROPOSAL
        ↓
CONFLICT CHECK
        ↓
NEW DECISION
        ↓
DOCUMENT UPDATE
```

اگر Conflict وجود داشته باشد، باید قبل از ادامه مشخص شود:

1. تصمیم قبلی هنوز معتبر است یا نه؛
2. تصمیم جدید آن را اصلاح می‌کند یا جایگزین؛
3. دلیل تغییر چیست؛
4. Evidence تغییر چیست؛
5. چه فایل‌ها و Phaseهایی تحت تأثیر قرار می‌گیرند.

هیچ تصمیم جدیدی نباید بی‌صدا تصمیم قبلی را کنار بزند.

---

## 9. DECISION CHANGE TRACEABILITY

هر تغییر مهم باید قابل ردیابی باشد:

```text
Change
 ↓
Reason
 ↓
Evidence
 ↓
Architectural Impact
 ↓
Dependency Impact
 ↓
Decision
 ↓
Roadmap / Constitution Update
```

این اصل مخصوصاً برای تغییرات مربوط به Core، Domain Boundaries، Memory، AI، Data Model، Security، Governance و Phase sequencing الزامی است.

---

## 10. IMPLEMENTED ≠ VERIFIED ≠ READY

وجود کد به‌تنهایی به معنی موفقیت نیست.

سه وضعیت باید جداگانه نگهداری شوند:

```text
Implemented
      ≠
Verified
      ≠
Ready
```

### Implemented
قابلیت در Repository وجود دارد.

### Verified
قابلیت با Evidence مستقل و قابل تکرار تأیید شده است.

### Ready
قابلیت و Foundationهای آن برای ورود به مرحله بعدی کافی و قابل دفاع هستند.

---

## 11. GITHUB AS THE PROJECT MEMORY

برای تصمیم‌های بلندمدت، GitHub Documentation باید نقش حافظه پایدار پروژه را ایفا کند.

Conversation memory می‌تواند برای ادامه کار مفید باشد، اما اگر بین آن و Source of Truth تعارض ایجاد شد، باید Repository بررسی و مرجع قرار گیرد.

بنابراین:

```text
Model Memory
      ↓
Helpful Context

GitHub Source of Truth
      ↓
Authoritative Project Memory
```

---

## 12. CLAUDE CODE / AGENT GOVERNANCE

Claude Code یا هر Agent توسعه‌دهنده دیگر نباید بر اساس حافظه مستقل خود تصمیم معماری بگیرد.

قبل از اجرای تغییرات مهم باید:

```text
Read Relevant Source of Truth
        ↓
Understand Current State
        ↓
Check Applicable Decisions
        ↓
Check Roadmap / Constitution
        ↓
Check Dependencies
        ↓
Implement
        ↓
Verify
        ↓
Record Evidence
```

Agent memory یا context نباید جایگزین Repository Governance شود.

---

## 13. FOUNDER AUTHORITY

Founder / Owner of DECIVEXA تصمیم نهایی درباره تغییرات مادی محصول و معماری را دارد.

اما Founder Authority به معنی حذف Architectural Challenge نیست.

فرآیند صحیح:

```text
Founder proposes
        ↓
Architecture challenges
        ↓
Evidence is reviewed
        ↓
Alternatives are considered
        ↓
Founder decides
        ↓
Decision is recorded
```

این ساختار هم Human Control را حفظ می‌کند و هم از تصمیم‌گیری بدون نقد جلوگیری می‌کند.

---

## 14. NO SILENT ARCHITECTURAL DRIFT

هیچ تغییر معماری مهمی نباید صرفاً در کد اتفاق بیفتد و بعداً به‌صورت ضمنی تبدیل به Architecture شود.

اگر Implementation با تصمیم ثبت‌شده متفاوت شد، یکی از این دو باید رخ دهد:

```text
Implementation corrected
        OR
Authoritative decision explicitly changed
```

هیچ حالت سومی به نام «همین‌طور شد» قابل قبول نیست.

---

## 15. RELATIONSHIP TO MASTER ROADMAP

Master Roadmap ترتیب تکامل DECIVEXA را مشخص می‌کند.

این سند مشخص می‌کند **چگونه از آن Roadmap به‌صورت قابل اتکا استفاده کنیم.**

Roadmap:

```text
What comes next?
```

Architecture Constitution:

```text
What rules govern the system?
```

Decision Source of Truth:

```text
Why did we choose this?
What is currently authoritative?
What changed?
```

Current State:

```text
What is actually implemented and verified now?
```

---

## 16. PRACTICAL RULE FOR EVERY FUTURE SESSION

در شروع هر کار مهم روی DECIVEXA، قبل از پیشنهاد یا اجرای تغییرات معماری، باید تا حد امکان این موارد بررسی شوند:

1. Master Roadmap
2. Architecture Constitution
3. Current State
4. Relevant Architecture Decisions
5. Founder Decisions
6. Architecture Backlog / Deferred Register
7. Existing implementation evidence
8. Relevant verification evidence

اگر یکی از این منابع موجود نیست یا وضعیت آن نامشخص است، نباید با حدس جایگزین شود.

---

## 17. FINAL GOVERNANCE PRINCIPLE

اصل نهایی:

> **Do not trust memory when the project can preserve the decision as evidence.**

و برای DECIVEXA:

> **Memory may help us remember. GitHub must help us know.**

این سند به‌عنوان یک Governance Reference برای جلوگیری از فراموشی تصمیم‌ها، تأیید غیرانتقادی، تناقض تصمیم‌ها و Architectural Drift ثبت می‌شود.
