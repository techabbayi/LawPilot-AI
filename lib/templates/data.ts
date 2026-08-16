export interface TemplateVariable {
  name: string;
  label: string;
  type: "text" | "number" | "date" | "select" | "textarea";
  required?: boolean;
  defaultValue?: string;
  options?: string[];
}

export interface LegalTemplate {
  _id: string;
  title: string;
  description: string;
  category: "Business" | "Employment" | "IP & Software" | "Corporate" | "Finance" | "Real Estate" | "Dispute & General";
  iconName: string;
  estimatedFillTime: string;
  complexity: "Standard" | "Medium" | "Comprehensive";
  variables: TemplateVariable[];
  templateBodyMarkdown: string;
}

export const LEGAL_TEMPLATES_50: LegalTemplate[] = [
  // ================= COMMERCIAL & BUSINESS (10) =================
  {
    _id: "tmpl_bus_01",
    title: "Mutual Non-Disclosure Agreement (NDA)",
    description: "Standard bilateral non-disclosure agreement protecting proprietary trade secrets, technical disclosures, and commercial negotiations.",
    category: "Business",
    iconName: "ShieldCheck",
    estimatedFillTime: "3 mins",
    complexity: "Standard",
    variables: [
      { name: "partyA", label: "Party A (Disclosing) Legal Name", type: "text", defaultValue: "Acme Innovations Inc." },
      { name: "partyB", label: "Party B (Receiving) Legal Name", type: "text", defaultValue: "Vance Holdings LLC" },
      { name: "effectiveDate", label: "Effective Date", type: "date", defaultValue: new Date().toISOString().split("T")[0] },
      { name: "termYears", label: "Confidentiality Term (Years)", type: "number", defaultValue: "3" },
      { name: "governingState", label: "Governing State Forum", type: "select", options: ["Delaware", "New York", "California", "Texas", "London / UK"], defaultValue: "Delaware" },
    ],
    templateBodyMarkdown: `# MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement (the "Agreement") is entered into on **{{effectiveDate}}** by and between **{{partyA}}** ("Party A") and **{{partyB}}** ("Party B").

### 1. Purpose & Confidential Information
The parties desire to evaluate a potential business opportunity. "Confidential Information" includes all technical data, trade secrets, software code, financial disclosures, and customer records disclosed by either party.

### 2. Obligations of Confidentiality
Each party agrees to hold Confidential Information in strict confidence and shall not disclose it to third parties for a period of **{{termYears}} years** from the Effective Date.

### 3. Exclusions from Confidentiality
Confidential Information does not include information that: (a) is or becomes publicly known, (b) was already in the receiving party's possession prior to disclosure, or (c) is independently developed without reference to the Disclosing Party's information.

### 4. Governing Law & Jurisdiction
This Agreement shall be governed by and construed in accordance with the laws of the State of **{{governingState}}**.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the Effective Date.

**PARTY A: {{partyA}}**  
By: ___________________________  
Title: Authorized Representative  

**PARTY B: {{partyB}}**  
By: ___________________________  
Title: Authorized Representative`,
  },
  {
    _id: "tmpl_bus_02",
    title: "One-Way Non-Disclosure Agreement",
    description: "Unilateral confidentiality agreement where one party discloses sensitive business data to an outside recipient.",
    category: "Business",
    iconName: "Lock",
    estimatedFillTime: "2 mins",
    complexity: "Standard",
    variables: [
      { name: "disclosingParty", label: "Disclosing Party Name", type: "text", defaultValue: "Global Tech Solutions Inc." },
      { name: "receivingParty", label: "Receiving Party Name", type: "text", defaultValue: "Apex Consulting Group" },
      { name: "purpose", label: "Business Purpose", type: "text", defaultValue: "Evaluation of potential merger & acquisition opportunity" },
      { name: "effectiveDate", label: "Effective Date", type: "date", defaultValue: new Date().toISOString().split("T")[0] },
      { name: "governingState", label: "Governing State Forum", type: "select", options: ["Delaware", "New York", "California"], defaultValue: "Delaware" },
    ],
    templateBodyMarkdown: `# ONE-WAY NON-DISCLOSURE AGREEMENT

This One-Way Confidentiality Agreement is made as of **{{effectiveDate}}**, by **{{receivingParty}}** ("Recipient") in favor of **{{disclosingParty}}** ("Discloser").

### 1. Business Purpose
Discloser intends to disclose proprietary business information solely for the purpose of **{{purpose}}**.

### 2. Recipient Undertakings
Recipient agrees to restrict access to Confidential Information strictly to employees with a need-to-know and shall implement security standards no less stringent than reasonable care.

### 3. Return of Materials
Upon Discloser's request, Recipient shall promptly return or destroy all physical and electronic copies of Confidential Information within 7 business days.

### 4. Governing Forum
This Agreement is governed by the laws of **{{governingState}}**.

**RECIPIENT: {{receivingParty}}**  
Signature: ___________________________  
Date: {{effectiveDate}}`,
  },
  {
    _id: "tmpl_bus_03",
    title: "Master Services Agreement (MSA)",
    description: "Enterprise service agreement covering deliverables, payment schedules, warranties, and liability caps.",
    category: "Business",
    iconName: "Briefcase",
    estimatedFillTime: "5 mins",
    complexity: "Comprehensive",
    variables: [
      { name: "serviceProvider", label: "Service Provider Name", type: "text", defaultValue: "LawPilot Enterprise Services LLC" },
      { name: "clientName", label: "Client Legal Name", type: "text", defaultValue: "Horizon Logistics Corp" },
      { name: "effectiveDate", label: "Effective Date", type: "date", defaultValue: new Date().toISOString().split("T")[0] },
      { name: "paymentTerms", label: "Payment Terms (Days)", type: "select", options: ["Net 15", "Net 30", "Net 60", "Due Upon Receipt"], defaultValue: "Net 30" },
      { name: "liabilityCapMonths", label: "Liability Cap (Months of Fees)", type: "number", defaultValue: "12" },
    ],
    templateBodyMarkdown: `# MASTER SERVICES AGREEMENT

This Master Services Agreement ("MSA") is entered into on **{{effectiveDate}}** between **{{serviceProvider}}** ("Provider") and **{{clientName}}** ("Client").

### 1. Scope of Services
Provider shall perform professional services set forth in individual Statements of Work ("SOW") executed by both parties.

### 2. Fees & Payment
Invoices shall be rendered monthly and payable within **{{paymentTerms}}** of receipt. Late payments accrue interest at 1.5% per month.

### 3. Limitation of Liability
TOTAL AGGREGATE LIABILITY OF EITHER PARTY SHALL NOT EXCEED THE TOTAL FEES PAID OR PAYABLE BY CLIENT UNDER THIS AGREEMENT DURING THE **{{liabilityCapMonths}} MONTHS** PRECEDING THE CLAIM.

### 4. Independent Contractor Status
Provider is an independent contractor. Neither party has authority to bind the other in any contract or representation.

**PROVIDER: {{serviceProvider}}**  
Signature: ___________________________  

**CLIENT: {{clientName}}**  
Signature: ___________________________`,
  },
  {
    _id: "tmpl_bus_04",
    title: "Service Level Agreement (SLA)",
    description: "SLA establishing uptime metrics, incident response times, maintenance windows, and service credit remedies.",
    category: "Business",
    iconName: "Activity",
    estimatedFillTime: "4 mins",
    complexity: "Medium",
    variables: [
      { name: "providerName", label: "Provider Name", type: "text", defaultValue: "CloudScale Infrastructure Inc." },
      { name: "customerName", label: "Customer Name", type: "text", defaultValue: "Apex Financial Systems" },
      { name: "uptimeCommitment", label: "Monthly Uptime Commitment (%)", type: "text", defaultValue: "99.9%" },
      { name: "supportResponseHours", label: "P1 Incident Response (Hours)", type: "number", defaultValue: "1" },
    ],
    templateBodyMarkdown: `# SERVICE LEVEL AGREEMENT (SLA)

This SLA is an exhibit to the Service Agreement between **{{providerName}}** ("Provider") and **{{customerName}}** ("Customer").

### 1. System Availability Commitment
Provider commits to maintaining **{{uptimeCommitment}}** aggregate availability for cloud platform operations during each calendar month.

### 2. Incident Response Matrix
- **Priority 1 (Critical Outage):** Initial response within **{{supportResponseHours}} hour(s)**.
- **Priority 2 (Major Impact):** Response within 4 hours.
- **Priority 3 (Minor Inquiry):** Response within 24 hours.

### 3. Service Credits
If uptime falls below 99.0% in a billing cycle, Customer shall receive a 10% credit applied against the subsequent monthly service fee.`,
  },
  {
    _id: "tmpl_bus_05",
    title: "Statement of Work (SOW)",
    description: "Detailed project milestone document specifying deliverables, timeline phases, acceptance criteria, and budget.",
    category: "Business",
    iconName: "FileCheck",
    estimatedFillTime: "4 mins",
    complexity: "Medium",
    variables: [
      { name: "projectName", label: "Project Title", type: "text", defaultValue: "Enterprise ERP System Migration Phase I" },
      { name: "vendorName", label: "Vendor Name", type: "text", defaultValue: "Vanguard Tech Solutions" },
      { name: "clientName", label: "Client Name", type: "text", defaultValue: "Global Logistics Corp" },
      { name: "totalBudget", label: "Total Project Fixed Budget ($)", type: "number", defaultValue: "75000" },
      { name: "completionDate", label: "Target Completion Date", type: "date", defaultValue: "2026-12-31" },
    ],
    templateBodyMarkdown: `# STATEMENT OF WORK (SOW #01)

Project Title: **{{projectName}}**  
Vendor: **{{vendorName}}**  
Client: **{{clientName}}**  

### 1. Key Deliverables & Phases
- **Phase 1:** Architecture Audit & Data Ingestion Pipeline.
- **Phase 2:** Core API Integration & Security Compliance.
- **Phase 3:** User Acceptance Testing & Deployment by **{{completionDate}}**.

### 2. Fixed Budget & Milestone Schedule
Total Fixed Fee: **\${{totalBudget}}** payable in three installments:
- 30% upon SOW execution.
- 40% upon Phase 2 completion.
- 30% upon final Client Sign-Off.`,
  },
  {
    _id: "tmpl_bus_06",
    title: "Independent Contractor Agreement",
    description: "Agreement defining freelance scope, work ownership, tax indemnification, and non-solicitation rules.",
    category: "Business",
    iconName: "UserCheck",
    estimatedFillTime: "3 mins",
    complexity: "Standard",
    variables: [
      { name: "companyName", label: "Company Legal Name", type: "text", defaultValue: "MediaPulse Digital LLC" },
      { name: "contractorName", label: "Contractor Legal Name", type: "text", defaultValue: "Sarah Jenkins" },
      { name: "hourlyRate", label: "Contractor Hourly Rate ($)", type: "number", defaultValue: "95" },
      { name: "effectiveDate", label: "Effective Date", type: "date", defaultValue: new Date().toISOString().split("T")[0] },
    ],
    templateBodyMarkdown: `# INDEPENDENT CONTRACTOR AGREEMENT

This Agreement is entered into as of **{{effectiveDate}}** between **{{companyName}}** ("Company") and **{{contractorName}}** ("Contractor").

### 1. Services & Compensation
Contractor agrees to perform consulting services. Company shall compensate Contractor at the rate of **\${{hourlyRate}}/hour**, invoiced bi-weekly.

### 2. Work Made For Hire
All intellectual property, software code, graphic assets, and reports created by Contractor under this Agreement belong exclusively to Company as work made for hire.

### 3. Tax Responsibility
Contractor is solely responsible for paying all federal, state, and local income taxes and self-employment contributions.`,
  },
  {
    _id: "tmpl_bus_07",
    title: "Subcontractor Agreement",
    description: "Prime contractor agreement assigning specific project duties, confidentiality, and pass-through liabilities to a subcontractor.",
    category: "Business",
    iconName: "Layers",
    estimatedFillTime: "4 mins",
    complexity: "Medium",
    variables: [
      { name: "primeContractor", label: "Prime Contractor Name", type: "text", defaultValue: "Apex Buildtech Systems" },
      { name: "subcontractor", label: "Subcontractor Name", type: "text", defaultValue: "Electra Volt Electricals LLC" },
      { name: "subFee", label: "Subcontract Fee ($)", type: "number", defaultValue: "32000" },
    ],
    templateBodyMarkdown: `# SUBCONTRACTOR AGREEMENT

Prime Contractor: **{{primeContractor}}**  
Subcontractor: **{{subcontractor}}**  

### 1. Scope & Pass-Through Covenants
Subcontractor agrees to perform specialized electrical installation services in accordance with prime contract terms.

### 2. Payment Terms
Total Subcontract Value: **\${{subFee}}**. Payment shall be made within 10 days after Prime Contractor receives payment from Owner ("Pay-When-Paid").`,
  },
  {
    _id: "tmpl_bus_08",
    title: "Business Partnership Agreement",
    description: "Bilateral partnership contract defining profit/loss distribution, voting thresholds, capital contributions, and buyout procedures.",
    category: "Business",
    iconName: "Users",
    estimatedFillTime: "5 mins",
    complexity: "Comprehensive",
    variables: [
      { name: "partnerA", label: "Partner A Name", type: "text", defaultValue: "Marcus Vance" },
      { name: "partnerB", label: "Partner B Name", type: "text", defaultValue: "Elena Rostova" },
      { name: "firmName", label: "Partnership Firm Name", type: "text", defaultValue: "Vance & Rostova Capital Partners" },
      { name: "shareA", label: "Partner A Ownership (%)", type: "number", defaultValue: "50" },
      { name: "shareB", label: "Partner B Ownership (%)", type: "number", defaultValue: "50" },
    ],
    templateBodyMarkdown: `# GENERAL PARTNERSHIP AGREEMENT

This Partnership Agreement is made by **{{partnerA}}** ({{shareA}}% Share) and **{{partnerB}}** ({{shareB}}% Share) forming **{{firmName}}**.

### 1. Capital Contributions & Profit Sharing
Partners shall contribute initial capital as agreed. Net profits and losses shall be distributed in proportion to ownership percentages.

### 2. Decision Making & Authority
Major financial commitments exceeding $25,000 require unanimous written consent of both Partners.`,
  },
  {
    _id: "tmpl_bus_09",
    title: "Joint Venture Agreement",
    description: "Strategic joint venture contract for collaborative commercial projects, IP sharing, and risk allocation.",
    category: "Business",
    iconName: "GitMerge",
    estimatedFillTime: "5 mins",
    complexity: "Comprehensive",
    variables: [
      { name: "party1", label: "Venturer 1 Name", type: "text", defaultValue: "Nexus Energy Corp" },
      { name: "party2", label: "Venturer 2 Name", type: "text", defaultValue: "Solaris Power Systems" },
      { name: "jvProject", label: "JV Project Scope", type: "text", defaultValue: "Development of 50MW Solar Grid Facility" },
    ],
    templateBodyMarkdown: `# JOINT VENTURE AGREEMENT

Venturer 1: **{{party1}}**  
Venturer 2: **{{party2}}**  
Scope: **{{jvProject}}**  

### 1. Joint Venture Purpose
The parties form a joint venture to co-develop commercial clean energy assets. Profits and losses are shared 50/50 unless specified otherwise.`,
  },
  {
    _id: "tmpl_bus_10",
    title: "Vendor Services Agreement",
    description: "Standard corporate procurement contract defining vendor obligations, quality audits, invoice terms, and warranties.",
    category: "Business",
    iconName: "Truck",
    estimatedFillTime: "3 mins",
    complexity: "Standard",
    variables: [
      { name: "buyerName", label: "Buyer Enterprise Name", type: "text", defaultValue: "Revogen Health Sciences" },
      { name: "vendorName", label: "Vendor Company Name", type: "text", defaultValue: "BioClean Equipment Corp" },
    ],
    templateBodyMarkdown: `# VENDOR SERVICES & PROCUREMENT AGREEMENT

Buyer: **{{buyerName}}**  
Vendor: **{{vendorName}}**  

Vendor agrees to supply laboratory items and maintenance services in compliance with FDA regulatory guidelines and ISO 9001 standards.`,
  },

  // ================= EMPLOYMENT & HR (10) =================
  {
    _id: "tmpl_emp_01",
    title: "Executive Employment Agreement",
    description: "Full executive contract specifying base salary, stock option vesting schedules, severance packages, and confidentiality.",
    category: "Employment",
    iconName: "UserCheck",
    estimatedFillTime: "4 mins",
    complexity: "Comprehensive",
    variables: [
      { name: "employeeName", label: "Executive Full Name", type: "text", defaultValue: "Jonathan Mercer" },
      { name: "jobTitle", label: "Executive Job Title", type: "text", defaultValue: "Chief Legal Officer" },
      { name: "annualSalary", label: "Base Annual Salary ($)", type: "number", defaultValue: "260000" },
      { name: "startDate", label: "Employment Start Date", type: "date", defaultValue: new Date().toISOString().split("T")[0] },
      { name: "noticeDays", label: "Termination Notice Period (Days)", type: "number", defaultValue: "30" },
    ],
    templateBodyMarkdown: `# EXECUTIVE EMPLOYMENT AGREEMENT

This Executive Employment Agreement is effective as of **{{startDate}}**, between LawPilot Technologies Inc. (the "Company") and **{{employeeName}}** ("Executive").

### 1. Title & Duties
Executive shall serve as **{{jobTitle}}**, reporting directly to the Chief Executive Officer and Board of Directors.

### 2. Base Compensation
The Company shall pay Executive a base annual salary of **\${{annualSalary}}**, payable in bi-weekly installments.

### 3. Termination Notice
Either party may terminate employment by providing **{{noticeDays}} days** prior written notice. Termination without cause entitles Executive to 6 months base salary severance.`,
  },
  {
    _id: "tmpl_emp_02",
    title: "Standard Employee Offer Letter",
    description: "At-will employment offer letter detailing starting compensation, benefits, start date, and contingency conditions.",
    category: "Employment",
    iconName: "MailCheck",
    estimatedFillTime: "2 mins",
    complexity: "Standard",
    variables: [
      { name: "candidateName", label: "Candidate Name", type: "text", defaultValue: "Amanda Zhao" },
      { name: "title", label: "Offered Position Title", type: "text", defaultValue: "Senior Full Stack Engineer" },
      { name: "salary", label: "Annual Starting Salary ($)", type: "number", defaultValue: "155000" },
      { name: "startDate", label: "Target Start Date", type: "date", defaultValue: new Date().toISOString().split("T")[0] },
    ],
    templateBodyMarkdown: `# AT-WILL EMPLOYMENT OFFER LETTER

Dear **{{candidateName}}**,

We are pleased to offer you employment at LawPilot Inc. in the position of **{{title}}**.

- **Starting Base Salary:** \${{salary}} / year
- **Start Date:** {{startDate}}
- **Employment Status:** Full-Time Regular (At-Will)

Please sign below to accept this offer.`,
  },
  {
    _id: "tmpl_emp_03",
    title: "Non-Compete & Non-Solicitation Agreement",
    description: "Restrictive covenant protecting client lists, team poaching, and competitive employment within a specified geographic radius.",
    category: "Employment",
    iconName: "ShieldAlert",
    estimatedFillTime: "3 mins",
    complexity: "Medium",
    variables: [
      { name: "employeeName", label: "Employee Name", type: "text", defaultValue: "David Sterling" },
      { name: "restrictedMonths", label: "Restricted Period (Months)", type: "number", defaultValue: "12" },
      { name: "geoRadius", label: "Geographic Radius (Miles)", type: "number", defaultValue: "50" },
    ],
    templateBodyMarkdown: `# NON-COMPETE & NON-SOLICITATION AGREEMENT

Employee: **{{employeeName}}**  

### 1. Non-Solicitation of Clients & Staff
For **{{restrictedMonths}} months** following departure, Employee shall not solicit Company clients or recruit Company personnel.

### 2. Geographic Limitation
Restricted activities apply within a **{{geoRadius}}-mile radius** of Company headquarters.`,
  },
  {
    _id: "tmpl_emp_04",
    title: "Employee Severance & General Release",
    description: "Separation agreement granting severance payout in exchange for a full waiver of employment liability claims.",
    category: "Employment",
    iconName: "FileMinus",
    estimatedFillTime: "3 mins",
    complexity: "Medium",
    variables: [
      { name: "employeeName", label: "Employee Name", type: "text", defaultValue: "Robert Vance" },
      { name: "severanceAmount", label: "Lump-Sum Severance Payout ($)", type: "number", defaultValue: "45000" },
      { name: "releaseDate", label: "Effective Separation Date", type: "date", defaultValue: new Date().toISOString().split("T")[0] },
    ],
    templateBodyMarkdown: `# SEVERANCE AGREEMENT & GENERAL RELEASE

Employee: **{{employeeName}}**  
Separation Date: **{{releaseDate}}**  

### 1. Severance Payout
Company agrees to pay Employee a gross lump-sum severance payment of **\${{severanceAmount}}**.

### 2. General Release of Claims
Employee irrevocably releases Company from all employment-related claims, grievances, and cause of action up to the date of execution.`,
  },
  {
    _id: "tmpl_emp_05",
    title: "Remote Work Policy Agreement",
    description: "Remote work agreement covering home workspace security, equipment care, working hours, and data protection.",
    category: "Employment",
    iconName: "Home",
    estimatedFillTime: "2 mins",
    complexity: "Standard",
    variables: [
      { name: "employeeName", label: "Employee Name", type: "text", defaultValue: "Melissa Chen" },
      { name: "remoteCity", label: "Approved Remote Location City", type: "text", defaultValue: "Austin, TX" },
    ],
    templateBodyMarkdown: `# REMOTE WORK POLICY AGREEMENT

Employee: **{{employeeName}}**  
Approved Work Location: **{{remoteCity}}**  

Employee agrees to maintain secure Wi-Fi protocols, protect company laptops from unauthorized access, and remain available during core business hours.`,
  },
  {
    _id: "tmpl_emp_06",
    title: "Employee Internship Agreement",
    description: "Paid or academic credit internship agreement outlining learning objectives, mentorship, and confidentiality.",
    category: "Employment",
    iconName: "GraduationCap",
    estimatedFillTime: "2 mins",
    complexity: "Standard",
    variables: [
      { name: "internName", label: "Intern Full Name", type: "text", defaultValue: "Lucas Miller" },
      { name: "stipend", label: "Monthly Stipend ($)", type: "number", defaultValue: "2500" },
    ],
    templateBodyMarkdown: `# INTERNSHIP AGREEMENT

Intern Name: **{{internName}}**  
Monthly Stipend: **\${{stipend}}**  

Intern agrees to participate in educational training activities under supervisor guidance while adhering to corporate confidentiality rules.`,
  },
  {
    _id: "tmpl_emp_07",
    title: "Consultant Advisory Agreement",
    description: "Professional consulting contract specifying retainer fees, advisory commitments, and stock option grants.",
    category: "Employment",
    iconName: "UserCheck",
    estimatedFillTime: "3 mins",
    complexity: "Medium",
    variables: [
      { name: "advisorName", label: "Advisor Name", type: "text", defaultValue: "Dr. Aris Thorne" },
      { name: "monthlyRetainer", label: "Monthly Retainer Fee ($)", type: "number", defaultValue: "5000" },
    ],
    templateBodyMarkdown: `# STRATEGIC ADVISORY AGREEMENT

Advisor: **{{advisorName}}**  
Monthly Retainer: **\${{monthlyRetainer}}**  

Advisor agrees to provide 10 hours of strategic guidance per month regarding technology roadmap and investor relations.`,
  },
  {
    _id: "tmpl_emp_08",
    title: "Proprietary Information & Inventions Agreement (PIIA)",
    description: "Standard tech company agreement assigning all inventions and patents created during employment to the company.",
    category: "Employment",
    iconName: "Cpu",
    estimatedFillTime: "3 mins",
    complexity: "Medium",
    variables: [
      { name: "employeeName", label: "Employee Name", type: "text", defaultValue: "Kevin Patel" },
    ],
    templateBodyMarkdown: `# PROPRIETARY INFORMATION & INVENTIONS ASSIGNMENT

Employee: **{{employeeName}}**  

Employee agrees that all copyrightable works, patent applications, trade secrets, and software developed during employment belong 100% to Company.`,
  },
  {
    _id: "tmpl_emp_09",
    title: "Relocation & Moving Expenses Agreement",
    description: "Employee relocation reimbursement agreement with clawback provisions if employee resigns within 12 months.",
    category: "Employment",
    iconName: "MapPin",
    estimatedFillTime: "2 mins",
    complexity: "Standard",
    variables: [
      { name: "employeeName", label: "Employee Name", type: "text", defaultValue: "Sarah Jenkins" },
      { name: "reimbursementAmount", label: "Relocation Allowance ($)", type: "number", defaultValue: "15000" },
    ],
    templateBodyMarkdown: `# RELOCATION EXPENSE REIMBURSEMENT AGREEMENT

Company agrees to reimburse Employee **\${{reimbursementAmount}}** for moving expenses. If Employee voluntarily resigns within 12 months, 100% of the reimbursement must be repaid.`,
  },
  {
    _id: "tmpl_emp_10",
    title: "Employee Performance Improvement Plan (PIP)",
    description: "Formal HR document establishing 30-day performance milestones and evaluation criteria.",
    category: "Employment",
    iconName: "TrendingUp",
    estimatedFillTime: "2 mins",
    complexity: "Standard",
    variables: [
      { name: "employeeName", label: "Employee Name", type: "text", defaultValue: "Michael Ross" },
    ],
    templateBodyMarkdown: `# PERFORMANCE IMPROVEMENT PLAN (PIP)

Employee: **{{employeeName}}**  
Plan Duration: 30 Days  

This PIP outlines required improvements in project delivery timeliness and communication protocols over the next 30 days.`,
  },

  // ================= INTELLECTUAL PROPERTY & IT (10) =================
  {
    _id: "tmpl_ip_01",
    title: "Master SaaS Terms of Service",
    description: "Enterprise SaaS contract with SLA availability guarantees, data privacy compliance, and symmetrical liability caps.",
    category: "IP & Software",
    iconName: "Cloud",
    estimatedFillTime: "4 mins",
    complexity: "Comprehensive",
    variables: [
      { name: "companyName", label: "SaaS Vendor Name", type: "text", defaultValue: "LawPilot AI Inc." },
      { name: "clientName", label: "Client Enterprise Name", type: "text", defaultValue: "Global Logistics Corp" },
      { name: "slaPercent", label: "Uptime Commitment (%)", type: "text", defaultValue: "99.9%" },
      { name: "liabilityCapMonths", label: "Liability Cap (Months of Fees)", type: "number", defaultValue: "12" },
    ],
    templateBodyMarkdown: `# MASTER SAAS SERVICE AGREEMENT

This Agreement is entered into by **{{companyName}}** ("Provider") and **{{clientName}}** ("Customer").

### 1. Service Level Commitment
Provider warrants an aggregate platform availability uptime of **{{slaPercent}}** during each calendar month.

### 2. Data Protection & Security
Provider maintains SOC2 Type II and GDPR compliant encryption standards across all stored customer records.

### 3. Limitation of Liability
Total aggregate liability of either party under this agreement shall be capped at the fees paid during the preceding **{{liabilityCapMonths}} months**.`,
  },
  {
    _id: "tmpl_ip_02",
    title: "End User License Agreement (EULA)",
    description: "Software license agreement governing desktop/mobile app installation, usage restrictions, and reverse engineering bans.",
    category: "IP & Software",
    iconName: "Code",
    estimatedFillTime: "3 mins",
    complexity: "Standard",
    variables: [
      { name: "softwareName", label: "Software Product Name", type: "text", defaultValue: "LawPilot Desktop v4" },
      { name: "publisherName", label: "Publisher Company Name", type: "text", defaultValue: "Revogen AI Technologies" },
    ],
    templateBodyMarkdown: `# END USER LICENSE AGREEMENT (EULA)

Software: **{{softwareName}}**  
Publisher: **{{publisherName}}**  

### 1. Grant of License
Publisher grants User a revocable, non-exclusive, non-transferable license to install and run the Software solely for internal business operations.

### 2. Restrictions
User shall not decompile, reverse engineer, disassemble, or attempt to derive source code from the Software.`,
  },
  {
    _id: "tmpl_ip_03",
    title: "Software Development Agreement",
    description: "Custom software engineering agreement specifying source code delivery, QA testing, warranty, and IP transfer.",
    category: "IP & Software",
    iconName: "Terminal",
    estimatedFillTime: "4 mins",
    complexity: "Comprehensive",
    variables: [
      { name: "developer", label: "Developer Studio Name", type: "text", defaultValue: "CodeCraft Studios LLC" },
      { name: "client", label: "Client Name", type: "text", defaultValue: "Nexus FinTech Corp" },
      { name: "totalFee", label: "Contract Fee ($)", type: "number", defaultValue: "85000" },
    ],
    templateBodyMarkdown: `# CUSTOM SOFTWARE DEVELOPMENT AGREEMENT

Developer: **{{developer}}**  
Client: **{{client}}**  
Total Fee: **\${{totalFee}}**  

Developer agrees to design, build, and deploy custom software applications. Upon receipt of full payment, all source code rights transfer to Client.`,
  },
  {
    _id: "tmpl_ip_04",
    title: "Website Privacy Policy (GDPR / CCPA)",
    description: "Comprehensive online privacy policy disclosing cookie usage, data collection, user rights, and DPO contacts.",
    category: "IP & Software",
    iconName: "EyeOff",
    estimatedFillTime: "3 mins",
    complexity: "Standard",
    variables: [
      { name: "websiteUrl", label: "Website Domain URL", type: "text", defaultValue: "https://lawpilot.ai" },
      { name: "companyName", label: "Operating Entity Name", type: "text", defaultValue: "LawPilot Systems Inc." },
      { name: "dpoEmail", label: "Data Protection Officer Email", type: "text", defaultValue: "privacy@lawpilot.ai" },
    ],
    templateBodyMarkdown: `# WEBSITE PRIVACY POLICY

Website: **{{websiteUrl}}**  
Entity: **{{companyName}}**  
DPO Email: **{{dpoEmail}}**  

### 1. Information We Collect
We collect personal identifiers, usage analytics, and cookie telemetry to optimize legal platform operations in accordance with GDPR and CCPA.`,
  },
  {
    _id: "tmpl_ip_05",
    title: "Website Terms & Conditions of Use",
    description: "Standard terms of use for web applications, user accounts, content ownership, and liability disclaimers.",
    category: "IP & Software",
    iconName: "Globe",
    estimatedFillTime: "3 mins",
    complexity: "Standard",
    variables: [
      { name: "siteName", label: "Website/Platform Name", type: "text", defaultValue: "LawPilot Portal" },
    ],
    templateBodyMarkdown: `# TERMS AND CONDITIONS OF USE

Welcome to **{{siteName}}**. By accessing this platform, users agree to comply with all acceptable use policies and governing law.`,
  },
  {
    _id: "tmpl_ip_06",
    title: "IP Assignment & Transfer Agreement",
    description: "Formal assignment transferring full patent, trademark, and software copyright rights from assignor to assignee.",
    category: "IP & Software",
    iconName: "Key",
    estimatedFillTime: "3 mins",
    complexity: "Medium",
    variables: [
      { name: "assignor", label: "Assignor Name (Seller)", type: "text", defaultValue: "Victor Vance" },
      { name: "assignee", label: "Assignee Name (Buyer)", type: "text", defaultValue: "Revogen IP Holdings LLC" },
      { name: "ipName", label: "IP Assets Description", type: "text", defaultValue: "US Patent #9,845,112 (Neural Legal Vectoring)" },
      { name: "purchasePrice", label: "Purchase Price ($)", type: "number", defaultValue: "120000" },
    ],
    templateBodyMarkdown: `# INTELLECTUAL PROPERTY ASSIGNMENT AGREEMENT

Assignor: **{{assignor}}**  
Assignee: **{{assignee}}**  
Price: **\${{purchasePrice}}**  

Assignor hereby sells, assigns, and transfers all worldwide rights, title, and interest in **{{ipName}}** to Assignee.`,
  },
  {
    _id: "tmpl_ip_07",
    title: "Trademark Licensing Agreement",
    description: "Agreement granting non-exclusive trademark usage rights for branded commercial distribution.",
    category: "IP & Software",
    iconName: "Award",
    estimatedFillTime: "3 mins",
    complexity: "Medium",
    variables: [
      { name: "licensor", label: "Licensor Brand Owner", type: "text", defaultValue: "Vance Luxury Goods Inc." },
      { name: "licensee", label: "Licensee Distributor", type: "text", defaultValue: "Apex Retail Partners" },
    ],
    templateBodyMarkdown: `# TRADEMARK LICENSE AGREEMENT

Licensor grants Licensee a non-exclusive license to utilize registered trademark logos solely on approved retail products.`,
  },
  {
    _id: "tmpl_ip_08",
    title: "Data Processing Addendum (DPA)",
    description: "GDPR/CCPA compliant data processing addendum between data controller and data processor.",
    category: "IP & Software",
    iconName: "Database",
    estimatedFillTime: "4 mins",
    complexity: "Comprehensive",
    variables: [
      { name: "controller", label: "Data Controller Name", type: "text", defaultValue: "Global Logistics Corp" },
      { name: "processor", label: "Data Processor Name", type: "text", defaultValue: "LawPilot Cloud Infrastructure" },
    ],
    templateBodyMarkdown: `# DATA PROCESSING ADDENDUM (DPA)

Controller: **{{controller}}**  
Processor: **{{processor}}**  

Processor agrees to process personal data strictly in accordance with Controller documented instructions and EU Standard Contractual Clauses (SCCs).`,
  },
  {
    _id: "tmpl_ip_09",
    title: "Copyright License & Assignment",
    description: "Agreement licensing or assigning artistic works, literary content, or graphic design assets.",
    category: "IP & Software",
    iconName: "PenTool",
    estimatedFillTime: "2 mins",
    complexity: "Standard",
    variables: [
      { name: "creator", label: "Creator/Artist Name", type: "text", defaultValue: "Elena Rostova" },
      { name: "client", label: "Publisher Name", type: "text", defaultValue: "Vanguard Media Group" },
    ],
    templateBodyMarkdown: `# COPYRIGHT LICENSE AGREEMENT

Creator transfers exclusive digital publication rights for the specified artworks to Publisher for commercial distribution worldwide.`,
  },
  {
    _id: "tmpl_ip_10",
    title: "API Terms of Service",
    description: "Developer terms governing REST API endpoints, rate limiting, access tokens, and sandbox usage.",
    category: "IP & Software",
    iconName: "Cpu",
    estimatedFillTime: "3 mins",
    complexity: "Standard",
    variables: [
      { name: "apiName", label: "API Service Name", type: "text", defaultValue: "LawPilot Intelligence REST API" },
    ],
    templateBodyMarkdown: `# API TERMS OF SERVICE

Developers using **{{apiName}}** must comply with rate limits (100 req/min) and keep API keys confidential at all times.`,
  },

  // ================= CORPORATE & GOVERNANCE (8) =================
  {
    _id: "tmpl_corp_01",
    title: "Corporate Board Resolution",
    description: "Formal resolution of the Board of Directors approving corporate transactions, banking authority, or executive hires.",
    category: "Corporate",
    iconName: "FileCheck",
    estimatedFillTime: "2 mins",
    complexity: "Standard",
    variables: [
      { name: "companyName", label: "Corporation Legal Name", type: "text", defaultValue: "Revogen AI Corporation" },
      { name: "resolutionTitle", label: "Resolution Subject Title", type: "text", defaultValue: "Approval of Series A Equity Financing & Credit Facility" },
      { name: "meetingDate", label: "Board Meeting Date", type: "date", defaultValue: new Date().toISOString().split("T")[0] },
    ],
    templateBodyMarkdown: `# BOARD OF DIRECTORS RESOLUTION

Corporation: **{{companyName}}**  
Date: **{{meetingDate}}**  

**RESOLVED**, that the Board hereby approves **{{resolutionTitle}}** and authorizes executive officers to execute all necessary legal documents.`,
  },
  {
    _id: "tmpl_corp_02",
    title: "Shareholder Agreement",
    description: "Comprehensive agreement governing shareholder rights, drag-along/tag-along clauses, and share transfer restrictions.",
    category: "Corporate",
    iconName: "PieChart",
    estimatedFillTime: "5 mins",
    complexity: "Comprehensive",
    variables: [
      { name: "companyName", label: "Company Name", type: "text", defaultValue: "Apex FinTech Inc." },
      { name: "shareholderA", label: "Shareholder A", type: "text", defaultValue: "Marcus Vance" },
      { name: "shareholderB", label: "Shareholder B", type: "text", defaultValue: "Amanda Zhao" },
    ],
    templateBodyMarkdown: `# SHAREHOLDER AGREEMENT

Company: **{{companyName}}**  
Shareholders: **{{shareholderA}}**, **{{shareholderB}}**  

Governs right of first refusal (ROFR), pre-emptive purchase rights, and board representation rules among shareholders.`,
  },
  {
    _id: "tmpl_corp_03",
    title: "LLC Operating Agreement",
    description: "Foundational agreement establishing LLC management structure, capital accounts, voting rights, and dissolution rules.",
    category: "Corporate",
    iconName: "Building2",
    estimatedFillTime: "5 mins",
    complexity: "Comprehensive",
    variables: [
      { name: "llcName", label: "LLC Legal Name", type: "text", defaultValue: "Vance Capital Ventures LLC" },
      { name: "state", label: "Formation State", type: "select", options: ["Delaware", "Wyoming", "Texas", "Nevada", "Florida"], defaultValue: "Delaware" },
    ],
    templateBodyMarkdown: `# LLC OPERATING AGREEMENT

LLC Name: **{{llcName}}**  
State of Formation: **{{state}}**  

This Operating Agreement establishes member-managed governance and profit distribution guidelines under the laws of {{state}}.`,
  },
  {
    _id: "tmpl_corp_04",
    title: "Share Purchase Agreement (SPA)",
    description: "Definitive stock purchase contract specifying share quantity, purchase price, representations, and warranties.",
    category: "Corporate",
    iconName: "DollarSign",
    estimatedFillTime: "4 mins",
    complexity: "Comprehensive",
    variables: [
      { name: "seller", label: "Stock Seller Name", type: "text", defaultValue: "Vanguard Holdings LLC" },
      { name: "buyer", label: "Stock Buyer Name", type: "text", defaultValue: "Horizon Capital Fund" },
      { name: "shareCount", label: "Number of Shares", type: "number", defaultValue: "100000" },
      { name: "pricePerShare", label: "Price Per Share ($)", type: "number", defaultValue: "2.50" },
    ],
    templateBodyMarkdown: `# SHARE PURCHASE AGREEMENT (SPA)

Seller: **{{seller}}**  
Buyer: **{{buyer}}**  
Shares: **{{shareCount}}** at **\${{pricePerShare}} / share** (Total: \${{shareCount * pricePerShare || 250000}})  

Seller agrees to transfer equity shares free and clear of all liens upon payment of the purchase price.`,
  },
  {
    _id: "tmpl_corp_05",
    title: "Stock Option Grant Agreement",
    description: "Incentive stock option (ISO/NSO) agreement detailing 4-year vesting schedule with 1-year cliff.",
    category: "Corporate",
    iconName: "Award",
    estimatedFillTime: "3 mins",
    complexity: "Medium",
    variables: [
      { name: "granteeName", label: "Optionee Employee Name", type: "text", defaultValue: "Jonathan Mercer" },
      { name: "optionCount", label: "Number of Options Granted", type: "number", defaultValue: "50000" },
      { name: "strikePrice", label: "Exercise Strike Price ($)", type: "number", defaultValue: "0.45" },
    ],
    templateBodyMarkdown: `# STOCK OPTION GRANT AGREEMENT

Grantee: **{{granteeName}}**  
Option Pool: **{{optionCount}} Shares** at **\${{strikePrice}} Strike Price**  

Vesting Schedule: 25% vests after 12 months (1-year cliff), with remaining options vesting monthly over 36 months.`,
  },
  {
    _id: "tmpl_corp_06",
    title: "Strategic Advisor Agreement",
    description: "Advisory board agreement granting FAST-style equity options in exchange for strategic mentorship.",
    category: "Corporate",
    iconName: "UserCheck",
    estimatedFillTime: "3 mins",
    complexity: "Medium",
    variables: [
      { name: "advisorName", label: "Advisor Name", type: "text", defaultValue: "Dr. Aris Thorne" },
      { name: "equityPercent", label: "Advisor Equity Grant (%)", type: "text", defaultValue: "0.5%" },
    ],
    templateBodyMarkdown: `# STRATEGIC ADVISOR AGREEMENT

Advisor: **{{advisorName}}**  
Equity Grant: **{{equityPercent}}**  

Advisor agrees to serve on the Advisory Board and provide 4 hours per month of executive strategic advisory.`,
  },
  {
    _id: "tmpl_corp_07",
    title: "LLC Member Interest Transfer Agreement",
    description: "Formal assignment of LLC membership units between exiting and incoming members.",
    category: "Corporate",
    iconName: "Repeat",
    estimatedFillTime: "3 mins",
    complexity: "Medium",
    variables: [
      { name: "transferor", label: "Exiting Member", type: "text", defaultValue: "Marcus Vance" },
      { name: "transferee", label: "Incoming Member", type: "text", defaultValue: "Elena Rostova" },
    ],
    templateBodyMarkdown: `# LLC MEMBERSHIP INTEREST TRANSFER

Transferor transfers 100% of their membership units in Vance Holdings LLC to Transferee with full consent of all LLC members.`,
  },
  {
    _id: "tmpl_corp_08",
    title: "Corporate Director Appointment Letter",
    description: "Official appointment agreement for independent non-executive corporate directors.",
    category: "Corporate",
    iconName: "Briefcase",
    estimatedFillTime: "2 mins",
    complexity: "Standard",
    variables: [
      { name: "directorName", label: "Director Name", type: "text", defaultValue: "Lady Evelyn Vance" },
    ],
    templateBodyMarkdown: `# DIRECTOR APPOINTMENT LETTER

Appointing **{{directorName}}** as Independent Director on the Board of Directors effective immediately.`,
  },

  // ================= FINANCE & INVESTMENT (6) =================
  {
    _id: "tmpl_fin_01",
    title: "Promissory Note (Interest Bearing)",
    description: "Formal loan repayment contract detailing principal, annual interest rate, monthly maturity dates, and acceleration upon default.",
    category: "Finance",
    iconName: "DollarSign",
    estimatedFillTime: "3 mins",
    complexity: "Medium",
    variables: [
      { name: "borrower", label: "Borrower Legal Name", type: "text", defaultValue: "Apex Logistics LLC" },
      { name: "lender", label: "Lender Legal Name", type: "text", defaultValue: "Vance Private Credit Fund" },
      { name: "principal", label: "Principal Amount ($)", type: "number", defaultValue: "150000" },
      { name: "interestRate", label: "Annual Interest Rate (%)", type: "number", defaultValue: "8.5" },
      { name: "maturityDate", label: "Maturity Date", type: "date", defaultValue: "2027-12-31" },
    ],
    templateBodyMarkdown: `# PROMISSORY NOTE

Principal Amount: **\${{principal}}**  
Interest Rate: **{{interestRate}}% per annum**  
Maturity Date: **{{maturityDate}}**  

FOR VALUE RECEIVED, **{{borrower}}** ("Borrower") promises to pay to **{{lender}}** ("Lender") the principal sum of **\${{principal}}** with accrued interest on or before the Maturity Date.`,
  },
  {
    _id: "tmpl_fin_02",
    title: "SAFE Agreement (Simple Agreement for Future Equity)",
    description: "Y-Combinator post-money SAFE instrument for seed startup financing with valuation cap and discount rate.",
    category: "Finance",
    iconName: "TrendingUp",
    estimatedFillTime: "4 mins",
    complexity: "Comprehensive",
    variables: [
      { name: "investorName", label: "Investor Name", type: "text", defaultValue: "Y-Ventures Capital Fund" },
      { name: "investmentAmount", label: "Investment Purchase Amount ($)", type: "number", defaultValue: "250000" },
      { name: "valuationCap", label: "Post-Money Valuation Cap ($)", type: "number", defaultValue: "8000000" },
    ],
    templateBodyMarkdown: `# SIMPLE AGREEMENT FOR FUTURE EQUITY (SAFE)

Investor: **{{investorName}}**  
Investment Amount: **\${{investmentAmount}}**  
Valuation Cap: **\${{valuationCap}}**  

In exchange for payment, Company issues Investor the right to equity shares upon qualified preferred stock financing.`,
  },
  {
    _id: "tmpl_fin_03",
    title: "Convertible Debt Note Agreement",
    description: "Convertible promissory note with automatic conversion triggers upon Series A financing.",
    category: "Finance",
    iconName: "Repeat",
    estimatedFillTime: "4 mins",
    complexity: "Comprehensive",
    variables: [
      { name: "noteHolder", label: "Note Holder Name", type: "text", defaultValue: "Angels Syndicate Fund" },
      { name: "noteAmount", label: "Note Principal ($)", type: "number", defaultValue: "100000" },
      { name: "discountRate", label: "Conversion Discount (%)", type: "number", defaultValue: "20" },
    ],
    templateBodyMarkdown: `# CONVERTIBLE PROMISSORY NOTE

Principal: **\${{noteAmount}}**  
Discount Rate: **{{discountRate}}%**  

Automatically converts into preferred stock upon next financing round exceeding $1,000,000.`,
  },
  {
    _id: "tmpl_fin_04",
    title: "Commercial Loan Agreement",
    description: "Comprehensive commercial credit facility agreement specifying covenants, financial reporting, and default remedies.",
    category: "Finance",
    iconName: "CreditCard",
    estimatedFillTime: "5 mins",
    complexity: "Comprehensive",
    variables: [
      { name: "borrower", label: "Borrower Name", type: "text", defaultValue: "Horizon Distribution Corp" },
      { name: "bankName", label: "Financial Institution Name", type: "text", defaultValue: "First Commercial Bank N.A." },
      { name: "loanAmount", label: "Loan Amount ($)", type: "number", defaultValue: "500000" },
    ],
    templateBodyMarkdown: `# COMMERCIAL LOAN AGREEMENT

Borrower: **{{borrower}}**  
Lender: **{{bankName}}**  
Facility: **\${{loanAmount}}** Credit Facility  

Lender agrees to extend credit subject to debt service coverage ratios and monthly financial audit reporting.`,
  },
  {
    _id: "tmpl_fin_05",
    title: "Personal Guaranty Agreement",
    description: "Unconditional personal guaranty backing business loan or lease obligations.",
    category: "Finance",
    iconName: "Shield",
    estimatedFillTime: "2 mins",
    complexity: "Standard",
    variables: [
      { name: "guarantor", label: "Guarantor Individual Name", type: "text", defaultValue: "Marcus Vance" },
      { name: "creditor", label: "Creditor Bank/Lender Name", type: "text", defaultValue: "First Commercial Bank" },
    ],
    templateBodyMarkdown: `# UNCONDITIONAL PERSONAL GUARANTY

Guarantor **{{guarantor}}** unconditionally guarantees full payment of all debt obligations owed to **{{creditor}}**.`,
  },
  {
    _id: "tmpl_fin_06",
    title: "Invoice Payment Terms & Penalty Policy",
    description: "Commercial payment policy establishing Net 30 terms, late payment interest penalties, and collection cost recovery.",
    category: "Finance",
    iconName: "FileText",
    estimatedFillTime: "2 mins",
    complexity: "Standard",
    variables: [
      { name: "companyName", label: "Company Name", type: "text", defaultValue: "LawPilot Enterprise Systems" },
    ],
    templateBodyMarkdown: `# COMMERCIAL INVOICE PAYMENT POLICY

All invoices rendered by **{{companyName}}** are due Net 30 days. Overdue balances accrue interest at 1.5% per month.`,
  },

  // ================= REAL ESTATE & PROPERTY (5) =================
  {
    _id: "tmpl_re_01",
    title: "Commercial Property Lease Agreement",
    description: "Triple-net (NNN) or gross commercial lease defining base rent, CAM expenses, security deposits, and permitted use.",
    category: "Real Estate",
    iconName: "Building",
    estimatedFillTime: "5 mins",
    complexity: "Comprehensive",
    variables: [
      { name: "landlord", label: "Landlord Legal Name", type: "text", defaultValue: "Vance Commercial Properties LLC" },
      { name: "tenant", label: "Tenant Legal Name", type: "text", defaultValue: "Apex FinTech Corp" },
      { name: "propertyAddress", label: "Premises Address", type: "text", defaultValue: "100 Financial Plaza, Suite 400, Wilmington, DE" },
      { name: "monthlyRent", label: "Base Monthly Rent ($)", type: "number", defaultValue: "8500" },
      { name: "leaseTermYears", label: "Lease Term (Years)", type: "number", defaultValue: "5" },
    ],
    templateBodyMarkdown: `# COMMERCIAL REAL ESTATE LEASE AGREEMENT

Landlord: **{{landlord}}**  
Tenant: **{{tenant}}**  
Premises: **{{propertyAddress}}**  

### 1. Term & Base Rent
Lease Term: **{{leaseTermYears}} years**. Monthly Base Rent: **\${{monthlyRent}}** due on the first day of each calendar month.`,
  },
  {
    _id: "tmpl_re_02",
    title: "Residential Tenancy Lease Agreement",
    description: "Standard residential lease agreement detailing monthly rent, security deposit rules, utility responsibilities, and pet rules.",
    category: "Real Estate",
    iconName: "Home",
    estimatedFillTime: "4 mins",
    complexity: "Medium",
    variables: [
      { name: "landlord", label: "Landlord Name", type: "text", defaultValue: "Robert Vance" },
      { name: "tenant", label: "Tenant Name", type: "text", defaultValue: "Sarah Jenkins" },
      { name: "address", label: "Property Address", type: "text", defaultValue: "742 Evergreen Terrace, Austin, TX" },
      { name: "rent", label: "Monthly Rent ($)", type: "number", defaultValue: "2400" },
    ],
    templateBodyMarkdown: `# RESIDENTIAL LEASE AGREEMENT

Landlord: **{{landlord}}**  
Tenant: **{{tenant}}**  
Address: **{{address}}**  

Monthly Rent: **\${{rent}}**. Security Deposit: **\${{rent}}** held in escrow. No unauthorized alterations.`,
  },
  {
    _id: "tmpl_re_03",
    title: "Commercial Sublease Agreement",
    description: "Sublease agreement allowing prime tenant to sublet office space to a subtenant.",
    category: "Real Estate",
    iconName: "Layers",
    estimatedFillTime: "3 mins",
    complexity: "Medium",
    variables: [
      { name: "sublandlord", label: "Sublandlord (Prime Tenant)", type: "text", defaultValue: "Global Logistics Corp" },
      { name: "subtenant", label: "Subtenant Name", type: "text", defaultValue: "Nexus AI Labs" },
    ],
    templateBodyMarkdown: `# COMMERCIAL SUBLEASE AGREEMENT

Sublandlord sublets Suite 302 to Subtenant subject to Master Lease covenants and Landlord consent.`,
  },
  {
    _id: "tmpl_re_04",
    title: "Property Management Agreement",
    description: "Contract between property owner and management firm detailing leasing duties, maintenance fees, and tenant handling.",
    category: "Real Estate",
    iconName: "Key",
    estimatedFillTime: "4 mins",
    complexity: "Medium",
    variables: [
      { name: "owner", label: "Property Owner", type: "text", defaultValue: "Vance Real Estate Holdings" },
      { name: "manager", label: "Management Firm", type: "text", defaultValue: "Apex Property Management LLC" },
    ],
    templateBodyMarkdown: `# PROPERTY MANAGEMENT AGREEMENT

Owner appoints Management Firm to collect rent, maintain grounds, and manage tenant relations for a 6% management fee.`,
  },
  {
    _id: "tmpl_re_05",
    title: "Real Estate Letter of Intent (LOI)",
    description: "Non-binding LOI establishing proposed purchase price, due diligence window, and financing contingency for real estate.",
    category: "Real Estate",
    iconName: "FileText",
    estimatedFillTime: "2 mins",
    complexity: "Standard",
    variables: [
      { name: "buyer", label: "Proposed Buyer", type: "text", defaultValue: "Horizon Capital Acquisitions" },
      { name: "offerPrice", label: "Proposed Purchase Offer ($)", type: "number", defaultValue: "2400000" },
    ],
    templateBodyMarkdown: `# REAL ESTATE LETTER OF INTENT (LOI)

Buyer proposes to purchase commercial property for **\${{offerPrice}}** subject to 45-day due diligence investigation.`,
  },

  // ================= DISPUTES & LEGAL DOCUMENTS (5) =================
  {
    _id: "tmpl_disp_01",
    title: "Mutual Release & Settlement Agreement",
    description: "Binding legal settlement resolving disputed claims, providing mutual releases, non-disparagement, and payment.",
    category: "Dispute & General",
    iconName: "ShieldCheck",
    estimatedFillTime: "4 mins",
    complexity: "Comprehensive",
    variables: [
      { name: "party1", label: "First Party Name", type: "text", defaultValue: "Apex Buildtech Systems" },
      { name: "party2", label: "Second Party Name", type: "text", defaultValue: "Electra Volt Electricals LLC" },
      { name: "settlementSum", label: "Settlement Payment ($)", type: "number", defaultValue: "18500" },
    ],
    templateBodyMarkdown: `# MUTUAL RELEASE & SETTLEMENT AGREEMENT

Party 1: **{{party1}}**  
Party 2: **{{party2}}**  
Settlement Sum: **\${{settlementSum}}**  

### 1. Settlement Payment & Release
Upon receipt of the Settlement Sum, both parties fully and forever release each other from all claims and pending litigation.`,
  },
  {
    _id: "tmpl_disp_02",
    title: "Formal Cease & Desist Letter (IP Infringement)",
    description: "Legal notice demanding immediate termination of unauthorized copyright or trademark infringement.",
    category: "Dispute & General",
    iconName: "AlertOctagon",
    estimatedFillTime: "2 mins",
    complexity: "Standard",
    variables: [
      { name: "infringerName", label: "Infringing Party Name", type: "text", defaultValue: "CopyCat Software LLC" },
      { name: "infringedWork", label: "Protected IP Work", type: "text", defaultValue: "LawPilot Vector Analytics Engine" },
    ],
    templateBodyMarkdown: `# FORMAL CEASE AND DESIST NOTICE

DEMAND TO CEASE AND DESIST UNAUTHORIZED INFRINGEMENT OF **{{infringedWork}}**.

We demand that **{{infringerName}}** immediately halt all unauthorized distribution within 5 business days to avoid federal copyright litigation.`,
  },
  {
    _id: "tmpl_disp_03",
    title: "General Durable Power of Attorney",
    description: "Grant of legal authority appointing an attorney-in-fact to handle financial and legal decisions.",
    category: "Dispute & General",
    iconName: "Award",
    estimatedFillTime: "3 mins",
    complexity: "Medium",
    variables: [
      { name: "principal", label: "Principal Grantor Name", type: "text", defaultValue: "Alexandra Vance" },
      { name: "agent", label: "Appointed Agent (Attorney-in-Fact)", type: "text", defaultValue: "Marcus Vance" },
    ],
    templateBodyMarkdown: `# GENERAL DURABLE POWER OF ATTORNEY

Principal **{{principal}}** hereby appoints **{{agent}}** as Attorney-in-Fact with full power to act in Principal's name regarding legal and financial affairs.`,
  },
  {
    _id: "tmpl_disp_04",
    title: "Formal Legal Demand Letter (Unpaid Invoices)",
    description: "Pre-litigation demand letter for overdue accounts receivable prior to filing a small claims lawsuit.",
    category: "Dispute & General",
    iconName: "FileMinus",
    estimatedFillTime: "2 mins",
    complexity: "Standard",
    variables: [
      { name: "debtorName", label: "Debtor Name", type: "text", defaultValue: "Overdue Client Inc." },
      { name: "debtAmount", label: "Unpaid Balance Amount ($)", type: "number", defaultValue: "14200" },
    ],
    templateBodyMarkdown: `# FORMAL DEMAND FOR PAYMENT

DEMAND FOR IMMEDIATE PAYMENT OF OVERDUE BALANCE: **\${{debtAmount}}**.

Failure to remit payment by **{{debtorName}}** within 7 days will result in legal action and credit reporting.`,
  },
  {
    _id: "tmpl_disp_05",
    title: "Sworn General Affidavit",
    description: "Official sworn written statement under oath certified by a notary public.",
    category: "Dispute & General",
    iconName: "FileCheck",
    estimatedFillTime: "2 mins",
    complexity: "Standard",
    variables: [
      { name: "affiantName", label: "Affiant Full Legal Name", type: "text", defaultValue: "Alexandra Vance, Esq." },
      { name: "stateCounty", label: "State & County", type: "text", defaultValue: "State of Delaware, County of New Castle" },
    ],
    templateBodyMarkdown: `# SWORN GENERAL AFFIDAVIT

State/County: **{{stateCounty}}**  

I, **{{affiantName}}**, being duly sworn, depose and state under penalty of perjury that the foregoing facts are true and correct.`,
  },
];
