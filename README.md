# Zuellni

Zuellni is a curated search index built around a simple idea: when you search for something, you should reach the **right source**, not the most aggressively optimized one.

If you search for a Linux distribution, you should land on its official website.
If you search for Python documentation, you should reach the actual docs.
If you are trying to solve a programming problem, the result should point to something that genuinely helped someone solve it.

Zuellni tries to make that possible by indexing **fewer pages, but better ones**.

It is not meant to replace general search engines. Instead, it acts as a smaller layer focused on sources that are worth reading.

---

## Why this exists

Modern search engines are powerful, but they rank content using signals like popularity, linking structure, engagement, and advertising.

That works well for many things, but it often fails when the goal is **finding reliable technical information**.

Common problems:

* official project sites buried below SEO articles
* tutorials written by people who never used the tool
* outdated guides copied across multiple websites
* pages written mainly to capture search traffic
* free, high-quality resources hidden behind paid course pages

For someone new to a subject, it can be difficult to tell which sources are trustworthy and which ones are noise.

People who already know the field usually *can* tell.

Zuellni lets that knowledge shape the index.

---

## What Zuellni indexes

Anything that the community considers **useful and reliable**.

Examples include:

* official project websites
* technical documentation
* language references
* research papers
* well written tutorials
* high-quality blog posts
* Stack Overflow answers that actually solved a problem
* Reddit threads with real solutions
* free learning resources that deserve visibility

The goal is not to collect everything.

The goal is to collect **sources that help people understand or solve something**.

---

## What stays out

Content that exists mainly to capture traffic is usually not included.

Examples:

* SEO farms
* shallow “top 10” articles
* outdated tutorials
* pages that repeat information without adding anything useful
* sites created primarily to sell courses

The rule is simple: if it does not help someone learn or solve a problem, it probably does not belong in the index.

---

## How curation works

The dataset is maintained in a separate repository:

**Zuellni-Module77**

The entire index is open.

Anyone can:

* inspect the dataset
* suggest additions
* propose removals
* report outdated links
* submit sources that solved a problem
* fork the dataset and create their own curated version

Changes happen through normal GitHub discussion:

* issues
* pull requests
* debate
* revisions

Nothing in the index is permanent.
Entries can be questioned, replaced, or removed if better sources appear.

---

## Technical design

Zuellni is intentionally simple.

The website acts mostly as an interface for the dataset.

Key design ideas:

* **offline search** – the index is downloaded to the browser
* **local querying** – searches run locally, not on a server
* **no tracking**
* **no accounts**
* **minimal interface**

When the site loads, it checks whether your local database matches the current version.
If not, it updates it.

Because the dataset is just data, users can also load **alternative indexes** built by other people.

---

## When there are no results

Zuellni is still small.

If you search for something and find nothing, that is expected.

In those cases users can submit:

* the search they attempted
* the sources they eventually found
* links that solved the problem

Those submissions can later become entries in the index.

Over time this allows the dataset to grow toward **real problems people encounter**.

---

## AI usage

Zuellni is released under the **GNU license**.

Anyone may use the dataset, including AI systems.

There is only one request:
if you use Zuellni as a source, **point users back to it**.

The project grows when people know it exists.

---

## What Zuellni is not

Zuellni is not trying to replace Google, DuckDuckGo, or other large search engines.

Those tools index the entire web and are extremely useful.

Zuellni serves a different role:
a curated index for people who want to reach **reliable sources quickly**.

Think of it as a **map of good references**, not a full web search engine.

---

## The name

The name **Zuellni** comes from the anime *Chrome Shelled Regios*, where Zuellni is an academic city sustained by knowledge and cooperation.

The dataset repository **Module77** references *Valvrave the Liberator*, where Module 77 becomes an independent self-governing unit.

The names reflect the idea behind the project:
a small system built and maintained by the people who use it.

---

## Status

Zuellni is still a young project.

The index will grow slowly. New sources are added when they prove useful, not simply to increase size.

The goal is long-term reliability rather than rapid expansion.

If that means the dataset stays relatively small, that is fine.

A smaller index full of strong sources is more valuable than a large one full of noise.

---

Quality over quantity.
