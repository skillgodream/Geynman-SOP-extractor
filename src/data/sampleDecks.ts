import { FeynmanDeck } from '../types/deck';

export const SAMPLE_DECKS: FeynmanDeck[] = [
  {
    id: 'deck-vmart-retail',
    title: 'V-Mart Price Markdown & Discount Management SOP',
    summary: 'Ensures all price changes and promotions are authorized, accurate, and correctly synchronized between shelf labels and the POS system. Prevents billing errors and ensures inventory records remain precise.',
    targetAudience: 'Store Managers, IT Supervisors, Pricing Administrators, and Cashier Leads',
    estimatedMinutes: 8,
    originalDocType: 'Retail Standard Operating Procedure SOP-VMART-104',
    heroImage: {
      diagramType: 'price_markdown',
      url: 'https://images.unsplash.com/photo-1556742049-0a670f4a4591?auto=format&fit=crop&w=1200&q=80',
      caption: 'V-Mart Retail Pricing Synchronization: Shelf Tag ₹700 <-> POS Database ₹700',
    },
    feynmanCoreConcept: {
      intuitiveExplanation: 'Think of a retail price tag like a contract signed between the store shelf and the checkout register. If the shelf promises ₹700 but the cash register charges ₹1,000, trust is broken immediately and customer disputes explode.',
      centralAnalogy: {
        title: 'The Synchronized Clock Analogy',
        analogyText: 'If the shelf talker says 30% off (₹1,000 down to ₹700) but the POS scanner has not been updated, it is like two clocks ticking at different speeds. The customer gets caught in the friction between them.',
        howItMapsToSOP: 'Step 4 (Updating POS) and Step 5 (Replacing Shelf Labels) must happen in tight sequence so no customer scans a price that contradicts the physical label on the floor.'
      }
    },
    cards: [
      {
        id: 'vmart-card-0',
        title: 'Before You Change a Price',
        subtitle: 'Authorization & verification',
        cardType: 'critical_rules',
        levelNumber: 0,
        feynmanExplanation: 'Never change a price based on a verbal request or casual instruction. You must have an approved markdown directive through official company channels.',
        badgeText: 'Setup Gate',
        criticalRules: [
          {
            type: 'must_do',
            rule: 'Confirm official instruction: Use a designated company channel; never rely on a verbal request.',
            consequenceOfFailure: 'Prevents unauthorized discounts, margin loss and audit discrepancies.',
            verificationCheck: 'Official company channel confirmed'
          },
          {
            type: 'must_do',
            rule: 'Verify the directive: Check document ID, authorized sign-off, SKU list, revised price and effective date.',
            consequenceOfFailure: 'Prevents unauthorized discounts, margin loss and audit discrepancies.',
            verificationCheck: 'Directive document ID verified'
          },
          {
            type: 'must_do',
            rule: 'Confirm before printing: Do not print or replace shelf tags until the approved price is verified.',
            consequenceOfFailure: 'Prevents unauthorized discounts, margin loss and audit discrepancies.',
            verificationCheck: 'Approved price verified'
          },
          {
            type: 'never_do',
            rule: 'NEVER DO: Do not act on casual requests or guess a markdown.',
            consequenceOfFailure: 'Prevents unauthorized discounts, margin loss and audit discrepancies.',
            verificationCheck: 'Casual request rejected'
          }
        ]
      },
      {
        id: 'vmart-card-1',
        title: 'Level 1: Step-by-Step Execution',
        subtitle: 'Operational Workflow',
        cardType: 'process_steps',
        levelNumber: 1,
        feynmanExplanation: 'Follow these 10 steps to ensure pricing accuracy from corporate instruction to end-of-day reconciliation.',
        badgeText: 'Process Map',
        image: {
          diagramType: 'flowchart',
          url: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?auto=format&fit=crop&w=1200&q=80',
          caption: 'Process Sequence: Receive Directive -> Update POS (₹1,000 to ₹700) -> Swap Floor Tags -> Audit Scan 10 Items -> EOD Log',
        },
        steps: [
          {
            stepNumber: 1,
            title: 'Step 1: Receive Approved Price Markdown Directive',
            action: 'Store Manager / Pricing Admin receives official corporate pricing directive via designated company channel.',
            whyItMatters: 'Role: Store Manager / Pricing Admin. Guarantees only authorized markdowns enter store pipeline.',
            criticalWatchout: 'Do not proceed without official corporate document signature.'
          },
          {
            stepNumber: 2,
            title: 'Step 2: Verify Price Authorization & SKU Schedule',
            action: 'Pricing Admin cross-checks directive SKU list, effective dates, and discount rates against corporate master list.',
            whyItMatters: 'Role: Pricing Administrator. Prevents applying discounts to non-eligible full-price stock.',
            criticalWatchout: 'Confirm exact promotional start/end timestamps.'
          },
          {
            stepNumber: 3,
            title: 'Step 3: Print Updated Shelf Talkers & Barcode Labels',
            action: 'Printing Lead generates new price labels and shelf talkers from authorized pricing software.',
            whyItMatters: 'Role: Printing Lead. Ensures physical tags show exact revised pricing and promotional terms.',
            criticalWatchout: 'Verify print clarity and scannable barcode alignment.'
          },
          {
            stepNumber: 4,
            title: 'Step 4: Update POS / Pricing System Database',
            action: 'IT / POS Supervisor updates central checkout database: Original price ₹1,000 to ₹700 (markdown ₹300 or 30%).',
            whyItMatters: 'Role: IT / POS Supervisor. Data/Math Box: Original ₹1,000 -> Sale ₹700 (₹300 or 30% discount). Aligns register scan with directive.',
            criticalWatchout: 'Must verify database sync before floor deployment.'
          },
          {
            stepNumber: 5,
            title: 'Step 5: Replace Shelf Edge Labels on Retail Floor',
            action: 'Floor Staff replaces old shelf talkers with new ₹700 labels across all designated aisles.',
            whyItMatters: 'Role: Floor Staff. Synchronizes physical floor pricing with updated POS database.',
            criticalWatchout: 'Remove ALL old full-price labels immediately.'
          },
          {
            stepNumber: 6,
            title: 'Step 6: Conduct Audit Scan of First 10 Items',
            action: 'Pricing Auditor scans 10 random floor items using handheld terminal to verify register matches shelf tag.',
            whyItMatters: 'Role: Pricing Auditor. Guarantees zero-defect alignment before store doors open.',
            criticalWatchout: 'Target: 100% scan accuracy across sample.'
          },
          {
            stepNumber: 7,
            title: 'Step 7: Activate Promotional Discounts at Checkout POS',
            action: 'POS Lead enables automated promotional discount rules on checkout lanes.',
            whyItMatters: 'Role: POS Lead. Ensures cashiers scan items smoothly without requiring manual overrides.',
            criticalWatchout: 'Test scanning on a closed checkout lane first.'
          },
          {
            stepNumber: 8,
            title: 'Step 8: Manage Customer Price Discrepancies at Checkout',
            action: 'Customer Desk / Cashier Lead resolves pricing disputes: verify displayed price, refer to manager if unauthorized override requested.',
            whyItMatters: 'Role: Customer Desk / Cashier Lead. Core Action: Verify displayed price, refer to manager if unauthorized override requested.',
            criticalWatchout: 'Never promise unauthorized overrides; refer to manager if directive limits are reached.'
          },
          {
            stepNumber: 9,
            title: 'Step 9: Process Floor & System Exception Vectors',
            action: 'Floor & System Leads execute specific fix protocols for missing SKUs, old POS prices, wrong labels, expired promos, damaged stock, and unauthorized discount requests.',
            whyItMatters: 'Role: Floor Supervisor / System Lead. Maintains 100% compliance across all 6 exception modes without inventing unauthorized rules.',
            criticalWatchout: 'Follow Level 3 Exception Matrix protocols strictly.'
          },
          {
            stepNumber: 10,
            title: 'Step 10: End-of-Day Markdown Reconciliation & Audit Logging',
            action: 'Store Manager compiles EOD markdown report, verifying total discount value matches corporate directive.',
            whyItMatters: 'Role: Store Manager. Completes compliance audit trail and prevents unlogged inventory shrinkage.',
            criticalWatchout: 'File signed EOD audit log in manager office.'
          }
        ]
      },
      {
        id: 'vmart-card-3',
        title: 'When a Price Change Fails',
        subtitle: 'Stop. Verify. Escalate.',
        cardType: 'pitfalls_troubleshooting',
        levelNumber: 3,
        feynmanExplanation: 'Stop. Verify. Escalate.',
        stopWorkTrigger: 'if POS price differs from the approved instruction.',
        badgeText: 'Troubleshooting',
        pitfalls: [
          {
            symptomOrMistake: 'SKU missing from approved list',
            rootCause: 'Do not change the price.',
            immediateFix: 'Verify the SKU and contact the supervisor.'
          },
          {
            symptomOrMistake: 'POS still shows old price',
            rootCause: 'Pause the markdown.',
            immediateFix: 'Check system update status and escalate to the supervisor.'
          },
          {
            symptomOrMistake: 'Shelf label and POS mismatch',
            rootCause: 'Remove misleading signage where appropriate and follow store policy.',
            immediateFix: 'Do not promise a discount.'
          },
          {
            symptomOrMistake: 'Expired offer',
            rootCause: 'Remove promotional signage.',
            immediateFix: 'Confirm the promotion has ended in POS.'
          }
        ]
      },
      {
        id: 'vmart-card-4',
        title: 'Price Markdown: Golden Rules',
        subtitle: 'PRICE MARKDOWN',
        cardType: 'critical_rules',
        levelNumber: 4,
        feynmanExplanation: 'Controls every associate must follow.',
        badgeText: 'Non-Negotiable',
        criticalRules: [
          {
            type: 'must_do',
            rule: 'AUTHORIZATION: Only apply markdowns listed in an approved instruction.',
            consequenceOfFailure: 'Financial loss, margin erosion, and audit failure.',
            verificationCheck: 'Approved price verified'
          },
          {
            type: 'must_do',
            rule: 'SKU MATCH: Check barcode, size, colour and variant before relabelling.',
            consequenceOfFailure: 'Mislabeled inventory and cashier price mismatch.',
            verificationCheck: 'Shelf label matches SKU'
          },
          {
            type: 'must_do',
            rule: 'POS FIRST: Confirm the revised price at checkout; a new shelf label is not enough.',
            consequenceOfFailure: 'Customer disputes and billing discrepancy.',
            verificationCheck: 'POS price tested'
          },
          {
            type: 'warning',
            rule: 'EXCEPTIONS: If shelf and POS prices differ, pause and escalate to the supervisor.',
            consequenceOfFailure: 'Unrecorded override and inventory loss.',
            verificationCheck: 'Escalation logged'
          }
        ]
      },
      {
        id: 'vmart-card-5',
        title: 'Scenario Quiz: Managing Checkout Pricing Discrepancies',
        subtitle: 'Active Recall',
        cardType: 'scenario_quiz',
        feynmanExplanation: 'Apply V-Mart pricing policy to a realistic customer checkout scenario.',
        badgeText: 'Active Recall',
        image: {
          diagramType: 'price_markdown',
          url: 'https://images.unsplash.com/photo-1556742049-0a670f4a4591?auto=format&fit=crop&w=1200&q=80',
          caption: 'Checkout Lane Dispute: Shelf label shows ₹700, POS scanner reads ₹1,000',
        },
        quiz: {
          scenario: 'A customer brings an item to the checkout register. The shelf edge tag says ₹700 (30% markdown from ₹1,000), but when the cashier scans the barcode, the POS display reads ₹1,000. The customer insists on paying ₹700 and demands an additional 20% verbal discount for the inconvenience.',
          question: 'According to V-Mart SOP Step 8 and Step 9 Vector 2, what is the exact compliant response?',
          options: [
            'Honor the displayed ₹700 shelf price per policy, log the POS discrepancy, and politely refuse the additional unapproved 20% verbal discount.',
            'Give the customer whatever price they ask for to avoid a manager escalation.',
            'Force the customer to pay ₹1,000 because the POS system is always right.',
            'Invent an arbitrary ₹500 override limit on the spot.'
          ],
          correctAnswerIndex: 0,
          feynmanFeedback: 'Spot on! V-Mart SOP mandates honoring legitimate displayed prices (shelf tag ₹700) to protect customer trust while strictly refusing unapproved verbal discounts to prevent audit write-ups and margin erosion.',
          distractorExplanations: [
            'Unapproved verbal discounts violate financial controls and result in audit write-ups.',
            'Forcing ₹1,000 ignores the shelf tag contract and causes checkout disputes.',
            'Fabricating numeric thresholds (like ₹500 overrides) violates absolute data grounding rules.'
          ]
        }
      },
      {
        id: 'vmart-card-6',
        title: 'V-Mart Pricing Pocket Reference & Metrics',
        subtitle: 'Verbatim Metrics',
        cardType: 'quick_reference',
        feynmanExplanation: 'Key mathematical formulas, sample calculations, and role accountability boundaries.',
        badgeText: 'Verbatim Metrics',
        referenceItems: [
          {
            label: 'Sample Calculation',
            value: 'Original ₹1,000 -> Sale ₹700',
            detail: 'Markdown ₹300 or 30% discount verbatim from Step 4.'
          },
          {
            label: 'Pre-Opening Audit',
            value: '10 Random Items Scanned',
            detail: 'Mandatory 100% scan match required in Step 6.'
          },
          {
            label: 'Step 4 Accountable Role',
            value: 'IT / POS Supervisor',
            detail: 'Must update POS database before floor tags are deployed.'
          },
          {
            label: 'Step 8 Accountable Role',
            value: 'Customer Desk / Cashier Lead',
            detail: 'Resolves price discrepancies without unauthorized overrides.'
          }
        ]
      }
    ]
  },
  {
    id: 'deck-cold-chain',
    title: 'Cold Chain Biologics & Temperature Excursion SOP',
    summary: 'A direct operational guide for maintaining sensitive biologic medications between 2°C and 8°C, and what exact actions to take the second a temperature breach occurs.',
    targetAudience: 'Pharmacy Techs, Clinical Nurses, and Warehouse Staff',
    estimatedMinutes: 7,
    originalDocType: 'Standard Operating Procedure SOP-CLIN-408',
    heroImage: {
      diagramType: 'cold_chain',
      url: 'https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=1200&q=80',
      caption: 'Calibrated digital probe monitoring: 2.0°C to 8.0°C target boundary',
    },
    feynmanCoreConcept: {
      intuitiveExplanation: 'Think of biologic vaccines like ice cream sandwiches on a hot summer picnic: they have a delicate physical protein shape. If they warm up even once, the proteins unravel like melted ice cream. Refreezing them does not fix the shape; it just preserves ruined medicine.',
      centralAnalogy: {
        title: 'The Melting Ice Cream Analogy',
        analogyText: 'Proteins in vaccines are tightly folded origami cranes. Room temperature shakes the paper until it collapses into a crumpled ball. Even if you place it back into ice, paper origami does not refold itself.',
        howItMapsToSOP: 'Every minute above 8°C irreversibly destroys potency. That is why the SOP mandates immediate quarantine—never assume re-chilling restores biologic safety.'
      }
    },
    cards: [
      {
        id: 'cc-card-1',
        title: 'The Core Mental Model: Protein Origami',
        subtitle: 'Why temperature is a life-or-death physical requirement',
        cardType: 'concept_analogy',
        feynmanExplanation: 'Biologic medications are living protein structures held together by fragile chemical bonds. They only work when their 3D shape fits into patient receptors like a specific key into a padlock.',
        badgeText: 'The 12-Year-Old Test',
        image: {
          diagramType: 'protein_origami',
          url: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1200&q=80',
          caption: 'Figure 1: Intact receptor key vs denatured non-functional protein chain',
        },
        analogy: {
          metaphor: 'A delicate chocolate key that will melt and distort if left in a warm pocket.',
          takeaway: 'Never trust medicine that experienced an unlogged excursion, even if it looks visually identical.'
        }
      },
      {
        id: 'cc-card-2',
        title: 'Non-Negotiable Red Lines & Golden Rules',
        subtitle: 'The 3 mistakes that compromise patient safety or destroy inventory',
        cardType: 'critical_rules',
        feynmanExplanation: 'These rules are absolute. Compromising on any of them renders entire batches invalid for clinical administration.',
        badgeText: 'Safety Red Lines',
        criticalRules: [
          {
            type: 'never_do',
            rule: 'NEVER discard suspect inventory before QA review.',
            consequenceOfFailure: 'Throws away potentially salvageable product and destroys insurance/audit traceability.',
            verificationCheck: 'Place in designated red QUARANTINE tote with excursion log form attached.'
          },
          {
            type: 'must_do',
            rule: 'MUST log excursions within 15 minutes of discovery.',
            consequenceOfFailure: 'Delays stability database checks and manufacturer expiration recalculations.',
            verificationCheck: 'Submit Excursion Ticket # and record logger min/max readings.'
          },
          {
            type: 'never_do',
            rule: 'NEVER store vaccines in refrigerator door bins or near back cooling coil.',
            consequenceOfFailure: 'Door bins experience +4°C swings per opening; coils induce sub-zero freezing.',
            verificationCheck: 'Ensure containers are placed in central wire baskets at least 3 inches from walls.'
          }
        ]
      },
      {
        id: 'cc-card-3',
        title: 'The 4-Step Excursion Emergency Protocol',
        subtitle: 'What to do the moment an alarm sounds',
        cardType: 'process_steps',
        feynmanExplanation: 'When a temperature sensor beeps, treat it like an ambulance dispatch: keep the door shut, seal the evidence, isolate the medicine, and inform QA.',
        badgeText: 'Execution Sequence',
        image: {
          diagramType: 'flowchart',
          url: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1200&q=80',
          caption: 'Protocol Sequence: Door Seal -> Cooler Prep -> Quarantine Sign -> QA Log',
        },
        steps: [
          {
            stepNumber: 1,
            title: 'Keep Door Closed & Record Digital Display',
            action: 'Do not swing the refrigerator door open to inspect. Note Current Temp, Max Temp, and Duration of breach from external logger display.',
            whyItMatters: 'Opening the door dumps whatever remaining cold air is left, accelerating thermal runaway.',
            criticalWatchout: 'Resist the urge to visually count vials until backup cold packs are prepped.'
          },
          {
            stepNumber: 2,
            title: 'Prepare Insulated Transfer Container',
            action: 'Pre-condition a certified cooler with conditioned frozen water packs separated by cardboard buffer layers.',
            whyItMatters: 'Direct contact with frozen ice blocks will freeze and crack liquid vials.',
            criticalWatchout: 'Always measure cooler internal temp (2°C–8°C) before placing vials inside.'
          },
          {
            stepNumber: 3,
            title: 'Affix Neon "QUARANTINE - DO NOT DISPENSE" Sign',
            action: 'Physically quarantine the affected batches with bright signage and zip-tie seal.',
            whyItMatters: 'Prevents another nurse or tech from accidentally administering compromised vials on the next shift.',
            criticalWatchout: 'Do not put vials back into general circulation under any circumstances.'
          },
          {
            stepNumber: 4,
            title: 'Notify Quality Assurance & File Excursion Log',
            action: 'Email temperature log CSV to QA and open Incident Ticket within 60 minutes.',
            whyItMatters: 'QA contacts the manufacturer stability database to determine if the cumulative degree-hours are safe.',
            criticalWatchout: 'Include lot numbers, expiration dates, and exact start/stop timestamps.'
          }
        ]
      },
      {
        id: 'cc-card-4',
        title: 'Field Troubleshooting & Common Traps',
        subtitle: 'Everyday friction points that fool experienced staff',
        cardType: 'pitfalls_troubleshooting',
        feynmanExplanation: 'Most cold-chain failures are caused not by compressor breakdowns, but by mundane human habits.',
        badgeText: 'Field Traps',
        pitfalls: [
          {
            symptomOrMistake: 'Logger shows 1.2°C (Sub-cooling / near freeze)',
            rootCause: 'Baskets pushed directly against the cold-plate evaporator on the back wall.',
            immediateFix: 'Pull basket forward 3 inches to restore convective air circulation.'
          },
          {
            symptomOrMistake: 'Temperature spikes every weekday at 14:00',
            rootCause: 'Delivery truck receiving door left propped open, blowing warm hallway air into pharmacy annex.',
            immediateFix: 'Enforce 2-person handoff protocol and automatic door closer inspect.'
          },
          {
            symptomOrMistake: 'Logger probe reading fluctuates wildly',
            rootCause: 'Probe fell out of glycol buffer bottle and is measuring ambient air instead of liquid core temperature.',
            immediateFix: 'Reseat thermocouple sensor securely in glycol solution vial.'
          }
        ]
      },
      {
        id: 'cc-card-5',
        title: 'Shift Dilemma: The 2:00 AM Power Flicker',
        subtitle: 'Test your operational judgment in a high-pressure scenario',
        cardType: 'scenario_quiz',
        feynmanExplanation: 'Knowledge is useless if you panic during night shift. Apply the Feynman principles to this realistic scenario.',
        badgeText: 'Active Recall',
        image: {
          diagramType: 'cold_chain',
          url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
          caption: 'Scenario Context: Sensor displays 9.4°C at 02:15 AM following power flicker',
        },
        quiz: {
          scenario: 'It is 02:15 AM on Saturday. A brief thunderstorm knocks out facility power for 12 minutes. The auxiliary generator kicks in. You check Refrigerator #3: the display reads 9.4°C (1.4°C above the 8°C limit). The compressor is humming loudly and the temperature is slowly trending down.',
          question: 'What is your immediate and legally compliant action?',
          options: [
            'Wait 30 minutes to see if the compressor brings it back below 8°C; if it recovers, no log is required.',
            'Immediately throw the entire contents into the biohazard disposal bin to prevent accidental injection.',
            'Leave the door closed, record the max excursion temp & duration, move contents to pre-chilled backup cooler with a QUARANTINE label, and log the incident.',
            'Transfer the vials into the -20°C freezer for 10 minutes to rapidly shock-cool them back into safe range.'
          ],
          correctAnswerIndex: 2,
          feynmanFeedback: 'Spot on! Never guess or shock-freeze biologics. Keeping the door closed preserves remaining cold air. Physical quarantine with bright labeling prevents human error on Sunday morning, while preserving the audit trail so QA can check stability data.',
          distractorExplanations: [
            'Waiting and not logging is a severe compliance violation: cumulative heat damage is invisible.',
            'Discarding immediately wastes tens of thousands of dollars before QA determines if the product has 72-hour thermal tolerance.',
            'Never freeze liquid vaccines (-20°C). Freezing water expands, shattering adjuvant crystals and completely inactivating the vaccine.'
          ]
        }
      },
      {
        id: 'cc-card-6',
        title: 'Pocket Reference & Critical Numbers',
        subtitle: 'Tape this next to every cold-storage unit',
        cardType: 'quick_reference',
        feynmanExplanation: 'Key numbers to memorize and emergency contact triggers.',
        badgeText: 'Cheat Sheet',
        referenceItems: [
          {
            label: 'Safe Storage Range',
            value: '2.0°C to 8.0°C (36°F to 46°F)',
            detail: 'Target setpoint is strictly 5.0°C (dead center of range).'
          },
          {
            label: 'Excursion Alert Threshold',
            value: '< 2.0°C or > 8.0°C for ≥ 5 min',
            detail: 'Requires immediate visual and electronic logging.'
          },
          {
            label: 'Reporting Window',
            value: 'Within 60 Minutes',
            detail: 'Email QA-ColdChain@hospital.org with data logger export.'
          },
          {
            label: 'Primary Backup Location',
            value: 'Pharmacy Vault Cold Room B-12',
            detail: 'Access badge code required; backup key in lockbox 4.'
          }
        ]
      }
    ]
  },
  {
    id: 'deck-incident-response',
    title: 'P1 Critical Incident Triage & Sev-1 Outage SOP',
    summary: 'A battlefield guide for software engineers and SREs to triage Sev-1 production outages, organize the war room, communicate with stakeholders, and restore service without causing secondary disasters.',
    targetAudience: 'Software Engineers, SREs, Engineering Managers, and On-Call Responders',
    estimatedMinutes: 8,
    originalDocType: 'Engineering Operational Runbook ENG-SOP-09',
    heroImage: {
      diagramType: 'incident_triage',
      url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
      caption: 'Incident Bridge Command: IC, Operations Lead, and Comms Liaison topology',
    },
    feynmanCoreConcept: {
      intuitiveExplanation: 'Think of a P1 outage like a 3-alarm structure fire. The firefighter pointing the hose at the flames (Incident Commander) cannot simultaneously give press conferences on television. You must split roles immediately: one person directs the rescue, one person talks to the crowd.',
      centralAnalogy: {
        title: 'The Hospital Trauma Center Analogy',
        analogyText: 'In an Emergency Room, the Trauma Surgeon does not answer family phone calls or scrub floors. The Trauma Chief issues single commands, nurses repeat them back ("closed-loop communication"), and the Communications Liaison speaks to executives.',
        howItMapsToSOP: 'During an outage, chaotic multi-voice Slack channels cause confusion. Designating an Incident Commander (IC) with strict radio silence rules cuts resolution time in half.'
      }
    },
    cards: [
      {
        id: 'ir-card-1',
        title: 'The Trauma Chief Model: Why Roles Are Split',
        subtitle: 'Preventing the bystander effect and executive derailment',
        cardType: 'concept_analogy',
        feynmanExplanation: 'When systems crash, natural human panic makes everyone talk at once or freeze. A structured command protocol turns a frantic mob into a surgical team.',
        badgeText: 'Cognitive Model',
        image: {
          diagramType: 'incident_triage',
          url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
          caption: 'Role Isolation: IC manages direction, Ops Lead executes, Comms Lead shields from external queries',
        },
        analogy: {
          metaphor: 'Air Traffic Control during an emergency landing.',
          takeaway: 'Only one voice gives commands; everyone else confirms status with closed-loop precision.'
        }
      },
      {
        id: 'ir-card-2',
        title: 'The 3 Golden Rules of Incident Command',
        subtitle: 'Non-negotiable operational discipline under fire',
        cardType: 'critical_rules',
        feynmanExplanation: 'Violating these three principles almost always prolongs outages and results in corrupted databases.',
        badgeText: 'Red Lines',
        criticalRules: [
          {
            type: 'must_do',
            rule: 'Mitigate first, debug root-cause second.',
            consequenceOfFailure: 'Engineers spend 2 hours trying to find a compiler bug while customers suffer 100% error rates instead of simply rolling back the latest deploy.',
            verificationCheck: 'Canary rollback or circuit-breaker trip executed before deep log parsing.'
          },
          {
            type: 'never_do',
            rule: 'NEVER allow uncoordinated production hotfixes or manual DB edits.',
            consequenceOfFailure: 'Manual unreviewed SQL queries frequently wipe secondary tables or destroy replication.',
            verificationCheck: 'All mitigation commands must be spoken aloud in the bridge and logged by the Scribe.'
          },
          {
            type: 'must_do',
            rule: 'Send external status update every 30 minutes, even if no progress.',
            consequenceOfFailure: 'Executive leadership storms the engineering bridge, breaking responder focus.',
            verificationCheck: 'Communications Lead posts timestamped update to Statuspage.'
          }
        ]
      },
      {
        id: 'ir-card-3',
        title: 'The 4 Phases of Incident Execution',
        subtitle: 'From pager alarm to stable production recovery',
        cardType: 'process_steps',
        feynmanExplanation: 'Follow this exact sequence. Never skip directly to remediation without establishing the Incident Command structure.',
        badgeText: 'Runbook Steps',
        image: {
          diagramType: 'flowchart',
          url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
          caption: 'Execution Sequence: Declare -> Assign 3 Roles -> Fast Mitigation -> All-Clear Check',
        },
        steps: [
          {
            stepNumber: 1,
            title: 'Declare Severity & Spin Up Bridge',
            action: 'Execute `/incident declare p1` in Slack. Automatically provisions Google Meet audio bridge and dedicated incident channel.',
            whyItMatters: 'Isolates incident chatter from normal engineering noise and pages the on-call rota.',
            criticalWatchout: 'Do not debate severity for 15 minutes; when in doubt, declare high and downgrade later.'
          },
          {
            stepNumber: 2,
            title: 'Assign the 3 Mandatory Roles',
            action: 'Appoint: 1) Incident Commander (IC), 2) Operations Lead (Ops), 3) Communications Lead (Comms).',
            whyItMatters: 'Comms shields the IC and Ops from VP queries; Ops executes hypotheses; IC oversees the board.',
            criticalWatchout: 'The IC must not write code or run CLI scripts. The IC only coordinates.'
          },
          {
            stepNumber: 3,
            title: 'Execute Fast Mitigation (Rollback / Shed Load)',
            action: 'Check recent deploys (last 2 hours). If correlation exists, trigger atomic rollback or activate rate-limiting bypass.',
            whyItMatters: 'Stops the bleeding immediately for end-users.',
            criticalWatchout: 'Verify database migration backward compatibility before executing schema downgrades.'
          },
          {
            stepNumber: 4,
            title: 'Confirm Green Metrics & Declare "All Clear"',
            action: 'Monitor error budget, p99 latency, and saturation for 20 continuous minutes before closing the bridge.',
            whyItMatters: 'Prematurely closing the bridge leads to secondary outage regressions.',
            criticalWatchout: 'Schedule blameless post-mortem within 48 business hours.'
          }
        ]
      },
      {
        id: 'ir-card-4',
        title: 'Traps: The Top 3 Outage Multipliers',
        subtitle: 'How engineers accidentally turn a 5-minute blip into a 4-hour disaster',
        cardType: 'pitfalls_troubleshooting',
        feynmanExplanation: 'Outages rarely become disasters because of software alone; human pressure amplifies small mistakes.',
        badgeText: 'Field Traps',
        pitfalls: [
          {
            symptomOrMistake: 'The "Hero Engineer" Cowboy Edit',
            rootCause: 'An engineer ssh-es into a live node and tweaks environment config without telling anyone.',
            immediateFix: 'Revoke direct shell write access; enforce changes through CI/CD canary automation.'
          },
          {
            symptomOrMistake: 'Thundering Herd after Restart',
            rootCause: 'Restarting all backend pods simultaneously causes millions of queued mobile apps to hit empty cache.',
            immediateFix: 'Gradually ramp traffic using ingress weight shifts (10% -> 25% -> 50% -> 100%).'
          },
          {
            symptomOrMistake: 'War Room Silence & Paralyzed Responders',
            rootCause: 'Unclear leadership where responders are waiting for someone else to take initiative.',
            immediateFix: 'IC initiates direct name-based assignments: "Alex, check Redis queue length. Report back in 3 minutes."'
          }
        ]
      },
      {
        id: 'ir-card-5',
        title: 'Active Recall: The Impatient Executive Dilemma',
        subtitle: 'Can you hold the line when leadership applies pressure?',
        cardType: 'scenario_quiz',
        feynmanExplanation: 'A real incident manager must protect their team from outside distraction while executing the procedure.',
        badgeText: 'Scenario Quiz',
        image: {
          diagramType: 'incident_triage',
          url: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&q=80',
          caption: 'Dilemma: Executive pressure on the active bridge while revenue losses mount',
        },
        quiz: {
          scenario: 'You are Incident Commander during a P1 payment checkout outage. Total revenue loss is $40,000/minute. The VP of Sales enters the audio bridge loudly asking: "What broke? Who pushed the code? When will this be fixed? I have a Fortune 500 client on the phone!"',
          question: 'What is your correct response as Incident Commander?',
          options: [
            'Mute the engineering team, apologize to the VP, and spend 10 minutes explaining the microservice topology to him.',
            'Firmly say: "Welcome VP. We are actively mitigating. Comms Lead Sarah will brief you in the #incident-updates channel. Please keep this voice bridge clear for responders."',
            'Tell the VP to fire the developer who made the latest Git commit.',
            'Leave the incident bridge to handle the executive call yourself.'
          ],
          correctAnswerIndex: 1,
          feynmanFeedback: 'Exemplary incident leadership! The IC must protect responder cognitive bandwidth. Directing executives to the designated Comms Lead in an asynchronous channel gives leadership the info they need while allowing engineers to restore customer service undisturbed.',
          distractorExplanations: [
            'Explaining architecture to executives on the live bridge halts mitigation and wastes tens of thousands of dollars per minute.',
            'Violates the blameless post-mortem culture and creates panic.',
            'If the IC abandons the helm, the incident lacks direction and chaos ensues.'
          ]
        }
      },
      {
        id: 'ir-card-6',
        title: 'Incident Pocket Card & SLAs',
        subtitle: 'Key SLA deadlines and bridge channels',
        cardType: 'quick_reference',
        feynmanExplanation: 'Keep these response windows bookmarked on your phone.',
        badgeText: 'Cheat Sheet',
        referenceItems: [
          {
            label: 'P1 SLA: Page-to-Acknowledge',
            value: '< 5 Minutes',
            detail: 'Secondary on-call paged if primary unacknowledged at 5m.'
          },
          {
            label: 'P1 SLA: First Public Statuspage Update',
            value: '< 15 Minutes',
            detail: 'Initial message acknowledging investigation.'
          },
          {
            label: 'P1 SLA: Recurring Cadence',
            value: 'Every 30 Minutes',
            detail: 'Post progress or "investigation continuing" note.'
          },
          {
            label: 'Post-Mortem Timeline',
            value: 'Within 48 Hours',
            detail: 'Draft blameless retro with root cause and 5 Whys.'
          }
        ]
      }
    ]
  },
  {
    id: 'deck-cleanroom-sop',
    title: 'Cleanroom ISO Class 5 Gowning & Aseptic Entry SOP',
    summary: 'Step-by-step physical gowning sequence, sterility boundary crossings, and touch contamination prevention for pharmaceutical and cleanroom manufacturing.',
    targetAudience: 'Cleanroom Operators, Lab Technicians, and QA Inspectors',
    estimatedMinutes: 6,
    originalDocType: 'GMP Standard Operating Procedure SOP-MFG-002',
    heroImage: {
      diagramType: 'cleanroom',
      url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
      caption: 'Airlock Demarcation Bench: Dirty (CNC) side to Sterile (ISO 5) side transition',
    },
    feynmanCoreConcept: {
      intuitiveExplanation: 'Think of human skin as an invisible dirt volcano: every minute, we shed 40,000 microscopic skin flakes teeming with bacteria. A cleanroom suit is not armor to protect you from the room; it is an airtight filter bag designed to keep your personal micro-dust trapped inside.',
      centralAnalogy: {
        title: 'The Inverted Space Suit & The Clean Bench Threshold',
        analogyText: 'Astronaut suits keep space out; cleanroom suits keep human biology in. The gowning bench is like a dimensional border between the Dirty World and the Pure World—your socks never touch the clean floor, and your sterile booties never touch the dirty floor.',
        howItMapsToSOP: 'Swinging your legs over the gowning bench without letting either foot touch the wrong side of the demarcation line is the single most critical motor skill.'
      }
    },
    cards: [
      {
        id: 'cr-card-1',
        title: 'The Skin Flake Volcano: The Core Intuition',
        subtitle: 'Why humans are the number-one contaminant in manufacturing',
        cardType: 'concept_analogy',
        feynmanExplanation: 'Machines do not shed skin, breathe moisture, or touch their foreheads. Humans do. The suit is a mechanical barrier that isolates biology from the product.',
        badgeText: 'Core Intuition',
        image: {
          diagramType: 'cleanroom',
          url: 'https://images.unsplash.com/photo-1584744982491-665216d95f8b?auto=format&fit=crop&w=1200&q=80',
          caption: 'Demarcation line: Boundary between unclassified airlock and positive-pressure sterile cleanroom',
        },
        analogy: {
          metaphor: 'A vacuum bag that seals in microscopic dust particles.',
          takeaway: 'Any gap in the suit cuff or neck is a leak where thousands of bacteria escape into the airflow.'
        }
      },
      {
        id: 'cr-card-2',
        title: 'The Demarcation Line: Non-Negotiable Invariants',
        subtitle: 'The 3 fatal contamination red lines',
        cardType: 'critical_rules',
        feynmanExplanation: 'Aseptic technique requires spatial discipline. Once sterile attire touches a non-sterile surface, it must be stripped and replaced.',
        badgeText: 'Sterility Red Lines',
        criticalRules: [
          {
            type: 'never_do',
            rule: 'NEVER allow bare skin or sterile gown fabric to touch the gowning room floor.',
            consequenceOfFailure: 'Microbes on the floor transfer to cleanroom air currents, failing environmental plate monitoring.',
            verificationCheck: 'Unfold coverall from chest height outward, never letting legs dangle to the floor.'
          },
          {
            type: 'must_do',
            rule: 'MUST sanitize gloved hands with 70% IPA after every physical touchpoint.',
            consequenceOfFailure: 'Zippers, door handles, and bench surfaces harbor spores.',
            verificationCheck: 'Apply 3mL 70% Sterile Isopropyl Alcohol and rub for 20 seconds until dry.'
          },
          {
            type: 'never_do',
            rule: 'NEVER adjust face mask or glasses with sterile gloves inside the airlock.',
            consequenceOfFailure: 'Transfer of facial sebum and respiratory droplets to cleanroom gloves.',
            verificationCheck: 'If face itch occurs, exit to pre-gowning buffer room and re-glove.'
          }
        ]
      },
      {
        id: 'cr-card-3',
        title: 'The 5-Step Gowning Sequence (Top-to-Bottom)',
        subtitle: 'Gravity dictates the gowning order',
        cardType: 'process_steps',
        feynmanExplanation: 'Always dress from top to bottom. If you put on clean booties first and then shake your hair cover, hair flakes fall directly onto your clean feet!',
        badgeText: 'Execution Flow',
        image: {
          diagramType: 'flowchart',
          url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
          caption: 'Top-to-Bottom Gravity Sequence: Bouffant -> Pre-Wash -> Hood -> Coverall -> Bench Leg Swing',
        },
        steps: [
          {
            stepNumber: 1,
            title: 'Bouffant Cap & Beard Cover (Hair Containment)',
            action: 'Tuck all stray hair completely beneath the bouffant cap. Verify ears and hairline in mirror.',
            whyItMatters: 'Top-down rule: Hair must be captured before clean attire is unpacked.',
            criticalWatchout: 'No hair strands visible; double-check behind ears.'
          },
          {
            stepNumber: 2,
            title: 'Pre-Wash Hands & Don Primary Nitrile Gloves',
            action: 'Wash hands for 30 seconds with antiseptic foam, dry thoroughly, and slip on primary non-sterile nitrile gloves.',
            whyItMatters: 'Provides clean contact for handling the sterile coverall packaging.',
            criticalWatchout: 'Tuck glove cuffs securely over wrist.'
          },
          {
            stepNumber: 3,
            title: 'The Hood & Goggles',
            action: 'Don sterile hood, snapping snaps around the neck. Put on fog-free goggles.',
            whyItMatters: 'Protects the face zone before the main torso suit is unzipped.',
            criticalWatchout: 'Only touch inner lining of the hood.'
          },
          {
            stepNumber: 4,
            title: 'The Coverall (Accordion Unfold)',
            action: 'Grasp coverall by the inner waist. Step into leg openings without letting legs drag on the floor. Zip upwards.',
            whyItMatters: 'Prevents floor particulate pickup.',
            criticalWatchout: 'Hold sleeves gathered at chest level during entry.'
          },
          {
            stepNumber: 5,
            title: 'The Gowning Bench "Leg Swing" & Sterile Booties',
            action: 'Sit on bench. Slip bootie onto right foot and swing right leg over demarcation line to clean side. Repeat for left leg.',
            whyItMatters: 'The demarcation line bench physically prevents dirty floor contact.',
            criticalWatchout: 'Never let bootie touch the dirty side of the floor.'
          }
        ]
      },
      {
        id: 'cr-card-4',
        title: 'Common Operator Traps & Physical Fixes',
        subtitle: 'Instincts from normal life that cause cleanroom violations',
        cardType: 'pitfalls_troubleshooting',
        feynmanExplanation: 'Habits that are harmless in daily life become critical violations in ISO Class 5 environments.',
        badgeText: 'Operator Traps',
        pitfalls: [
          {
            symptomOrMistake: 'Rapid body movements and swinging arms',
            rootCause: 'Operator rushing to meet production quotas creates turbulent air eddies.',
            immediateFix: 'Move deliberately at half-speed; laminar flow requires smooth, slow hand passes.'
          },
          {
            symptomOrMistake: 'Coverall zipper gap at the collar',
            rootCause: 'Operator forgot to fasten snap flap over the zipper pull.',
            immediateFix: 'Partner check: operators inspect each other in the mirror before airlock door opens.'
          },
          {
            symptomOrMistake: 'Bootie soles slipping on smooth cleanroom epoxy floor',
            rootCause: 'Worn non-skid tread or moisture on cleanroom floor.',
            immediateFix: 'Replace booties immediately; verify floor dryness.'
          }
        ]
      },
      {
        id: 'cr-card-5',
        title: 'Active Recall: The Airlock Knee Reflex',
        subtitle: 'Can you catch the muscle-memory slip before contamination occurs?',
        cardType: 'scenario_quiz',
        feynmanExplanation: 'Test your instinctive reaction to unexpected physical balance issues.',
        badgeText: 'Scenario Quiz',
        image: {
          diagramType: 'cleanroom',
          url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1200&q=80',
          caption: 'Demarcation Bench crossing: Heel brush incident on entry side',
        },
        quiz: {
          scenario: 'You are seated on the cleanroom demarcation bench putting on your right sterile bootie. As you swing your right leg over to the clean side, you momentarily lose your balance and your right bootie heel lightly brushes the dirty floor on the entry side.',
          question: 'What is the correct SOP requirement?',
          options: [
            'Quickly rub your shoe with your gloved hand and proceed into the production room.',
            'Spray 70% IPA generously onto the bottom of the bootie and wait 10 seconds.',
            'Remove the contaminated bootie, throw it in the waste bin, sanitize gloves with IPA, and don a fresh sterile bootie from the dispenser.',
            'Continue anyway because the dirty floor was swept this morning.'
          ],
          correctAnswerIndex: 2,
          feynmanFeedback: 'Correct! 70% IPA does not instantly kill fungal spores on porous cloth soles. Once a bootie touches the unclassified floor, it is biologically compromised. Discarding, sanitizing gloves, and putting on a fresh bootie is the only aseptic solution.',
          distractorExplanations: [
            'Rubbing with gloved hand spreads floor bacteria to your sterile gloves, doubling the contamination.',
            'IPA spray is not certified as an instant sterilant for dirty floor-contact fabric.',
            'Morning sweeping does not meet ISO Class 5 sterility standards.'
          ]
        }
      },
      {
        id: 'cr-card-6',
        title: 'Aseptic Standards & Airflow Reference',
        subtitle: 'ISO standards and gowning parameters',
        cardType: 'quick_reference',
        feynmanExplanation: 'Environmental specs for Class 5 manufacturing areas.',
        badgeText: 'Quick Reference',
        referenceItems: [
          {
            label: 'ISO Class 5 Limit',
            value: '≤ 3,520 particles / m³ (≥ 0.5 µm)',
            detail: 'Normal room air contains > 35,000,000 particles.'
          },
          {
            label: 'Airflow Velocity',
            value: '0.45 m/s ± 20% (Unidirectional)',
            detail: 'Gentle downward laminar air shower sweeps dust downward.'
          },
          {
            label: 'Gloves Disinfection Interval',
            value: 'Every 30 Minutes or Post-Touch',
            detail: '70% Sterile Filtered Isopropyl Alcohol spray.'
          },
          {
            label: 'Differential Pressure Airlock',
            value: '+15 Pascals positive pressure',
            detail: 'Air rushes OUT when doors open, never IN.'
          }
        ]
      }
    ]
  }
];
