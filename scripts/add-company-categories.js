require('dotenv').config();
const mongoose = require('mongoose');
const Company = require('../models/Company');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/careercraft';

const additions = [
  ['NatWest Group', 'natwest-group', 'Investment & Banking', 'natwest.com', 'Edinburgh, UK'],
  ['Fidelity Investments', 'fidelity-investments', 'Investment & Banking', 'fidelity.com', 'Boston, MA'],
  ['BlackRock', 'blackrock', 'Investment & Banking', 'blackrock.com', 'New York, NY'],
  ['The Vanguard Group', 'vanguard', 'Investment & Banking', 'vanguard.com', 'Malvern, PA'],
  ['Charles Schwab', 'charles-schwab', 'Investment & Banking', 'schwab.com', 'Westlake, TX'],
  ['State Street', 'state-street', 'Investment & Banking', 'statestreet.com', 'Boston, MA'],
  ['UBS', 'ubs', 'Investment & Banking', 'ubs.com', 'Zurich, Switzerland'],
  ['Barclays', 'barclays', 'Investment & Banking', 'barclays.com', 'London, UK'],
  ['HSBC', 'hsbc', 'Investment & Banking', 'hsbc.com', 'London, UK'],
  ['Deutsche Bank', 'deutsche-bank', 'Investment & Banking', 'db.com', 'Frankfurt, Germany'],
  ['Morgan Stanley Capital', 'morgan-stanley-capital', 'Investment & Banking', 'morganstanley.com', 'New York, NY'],
  ['Jefferies', 'jefferies', 'Investment & Banking', 'jefferies.com', 'New York, NY'],
  ['ServiceNow', 'servicenow', 'Technology & SaaS', 'servicenow.com', 'Santa Clara, CA'],
  ['Atlassian', 'atlassian', 'Technology & SaaS', 'atlassian.com', 'Sydney, Australia'],
  ['Adobe', 'adobe', 'Technology & SaaS', 'adobe.com', 'San Jose, CA'],
  ['Salesforce', 'salesforce', 'Technology & SaaS', 'salesforce.com', 'San Francisco, CA'],
  ['Deloitte', 'deloitte', 'Consulting & Professional Services', 'deloitte.com', 'London, UK'],
  ['Kearney', 'kearney', 'Consulting & Professional Services', 'kearney.com', 'Chicago, IL'],
  ['Johnson & Johnson', 'johnson-johnson', 'Healthcare & Life Sciences', 'jnj.com', 'New Brunswick, NJ'],
  ['Roche', 'roche', 'Healthcare & Life Sciences', 'roche.com', 'Basel, Switzerland'],
  ['Lululemon', 'lululemon', 'Retail & Consumer', 'lululemon.com', 'Vancouver, Canada'],
  ['IKEA', 'ikea', 'Retail & Consumer', 'ikea.com', 'Delft, Netherlands'],
  ['Warner Bros. Discovery', 'warner-bros-discovery', 'Media & Entertainment', 'wbd.com', 'New York, NY'],
  ['Spotify', 'spotify', 'Media & Entertainment', 'spotify.com', 'Stockholm, Sweden']
].map(([name, slug, category, domain, location]) => ({
  name,
  slug,
  category,
  domain,
  industry: category,
  location,
  size: 'Global company',
  employeeCount: '10,000+',
  customerCount: 'Millions of customers worldwide',
  founded: 'Established global business',
  description: `${name} careers and company intelligence on CareerCraft.`,
  features: ['Professional development', 'Competitive benefits', 'Cross-functional teams'],
  jobs: []
}));

function jobsFor(company) {
  const base = company.category === 'Investment & Banking'
    ? [
      ['Investment Analyst', 'Investment Research', 'Financial modelling, Excel, valuation'],
      ['Risk Analyst', 'Risk Management', 'Risk analysis, SQL, communication'],
      ['Software Engineer', 'Technology', 'Python, JavaScript, APIs']
    ]
    : company.category === 'Consulting & Professional Services'
      ? [['Business Analyst', 'Consulting', 'Excel, analysis, stakeholder management'], ['Management Consultant', 'Advisory', 'Problem solving, communication, strategy']]
      : company.category === 'Healthcare & Life Sciences'
        ? [['Data Analyst', 'Analytics', 'SQL, Python, reporting'], ['Software Engineer', 'Technology', 'Software development, testing, APIs']]
        : [['Software Engineer', 'Engineering', 'JavaScript, APIs, cloud systems'], ['Product Analyst', 'Product', 'SQL, analytics, communication']];
  const fullTimeJobs = base.slice(0, 2).map(([title, department, requirements], index) => ({
    title,
    department,
    location: company.location,
    type: 'Full-time',
    experience: 'Entry-Mid',
    salary: 'Competitive',
    stipend: '',
    applicationDeadline: new Date(Date.now() + (index + 35) * 86400000),
    description: `Work with ${company.name} on meaningful products and measurable outcomes.`,
    requirements: requirements.split(', '),
    skills: requirements.split(', '),
    applyUrl: company.domain ? `https://${company.domain}/careers` : '',
    source: 'CareerCraft company catalog'
  }));
  const internshipRequirements = company.category === 'Investment & Banking'
    ? ['Excel', 'Financial analysis', 'Communication']
    : company.category === 'Consulting & Professional Services'
      ? ['Research', 'Excel', 'Presentation skills']
      : ['Python or JavaScript', 'Problem solving', 'Communication'];
  return [...fullTimeJobs, {
    title: `${company.category === 'Investment & Banking' ? 'Finance' : 'Business'} Summer Intern`,
    department: company.category || 'Early Careers',
    location: company.location,
    type: 'Internship',
    experience: 'Student / Graduate',
    salary: '',
    stipend: 'Paid internship · stipend varies by location',
    applicationDeadline: new Date(Date.now() + 28 * 86400000),
    description: `A structured internship at ${company.name} with mentorship and hands-on project work.`,
    requirements: internshipRequirements,
    skills: internshipRequirements,
    applyUrl: company.domain ? `https://${company.domain}/careers` : '',
    source: 'CareerCraft company catalog'
  }];
}

function inferCategory(company) {
  const text = `${company.category || ''} ${company.industry || ''} ${company.name || ''}`.toLowerCase();
  if (/bank|investment|capital|fidelity|blackrock|vanguard|schwab|state street|ubs|barclays|hsbc|deutsche|jefferies|goldman|paypal|visa|mastercard|wells fargo|jpmorgan/.test(text)) return 'Investment & Banking';
  if (/consult|advis|deloitte|accenture|pwc|ey|kpmg|bain|bcg|mckinsey/.test(text)) return 'Consulting & Professional Services';
  if (/health|pharma|medical|biotech|pfizer|moderna|roche|johnson/.test(text)) return 'Healthcare & Life Sciences';
  if (/retail|consumer|costco|target|walmart|nike|starbucks|mcdonald|ikea|lululemon|coca/.test(text)) return 'Retail & Consumer';
  if (/media|entertain|spotify|netflix|warner|twitter/.test(text)) return 'Media & Entertainment';
  return 'Technology & SaaS';
}

async function run() {
  await mongoose.connect(MONGO_URI);
  const companies = await Company.find({}).select('_id name industry category').lean();
  for (const company of companies) {
    await Company.updateOne({ _id: company._id }, { $set: { category: inferCategory(company) } });
  }
  for (const company of additions) {
    const { category, industry, jobs, employeeCount, customerCount, founded, description, features, ...insertFields } = company;
    await Company.updateOne({ slug: company.slug }, { $setOnInsert: insertFields, $set: { category, industry, jobs: jobsFor(company), employeeCount, customerCount, founded, description, features } }, { upsert: true });
  }
  const allCompanies = await Company.find({}).lean();
  for (const company of allCompanies) {
    const generatedJobs = jobsFor({ ...company, category: company.category || inferCategory(company) });
    const existingJobs = company.jobs || [];
    const hasInternship = existingJobs.some(job => /intern/i.test(job.type || job.title || ''));
    const jobs = existingJobs.length ? (hasInternship ? existingJobs : [...existingJobs, generatedJobs[2]]) : generatedJobs;
    await Company.updateOne({ _id: company._id }, { $set: { jobs } });
  }
  const total = await Company.countDocuments();
  const grouped = await Company.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { count: -1 } }]);
  console.log(JSON.stringify({ total, grouped }, null, 2));
  await mongoose.disconnect();
}

run().catch((error) => { console.error(error); process.exit(1); });
