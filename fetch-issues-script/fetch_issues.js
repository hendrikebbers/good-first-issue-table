import 'dotenv/config';
import fetch from 'node-fetch';
import { writeFileSync } from 'fs';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const HEADERS = {
  'Accept': 'application/vnd.github.v3+json',
  'Authorization': `token ${GITHUB_TOKEN}`
};


const OPEN_ELEMENTS_REPOS = [
  'OpenElements/open-elements-website',
  'OpenElements/hedera-enterprise',
  'OpenElements/hedera-solo-action'
];
const HEDERA_REPOS = [
  'OpenElements/hedera-enterprise',
  'OpenElements/hedera-solo-action',
  'hashgraph/hedera-services',
  'hashgraph/hedera-grpcWeb-proxy',
  'hashgraph/hedera-exchange-rate-tool',
  'hashgraph/hedera-sdk-tck',
  'hashgraph/hedera-json-rpc-relay',
  'hashgraph/hedera-local-node',
  'hashgraph/hedera-mirror-node',
  'hashgraph/hedera-services',
  'hashgraph/hedera-sdk-js',
  'hashgraph/hedera-sdk-swift',
  'hashgraph/hedera-sdk-rust',
  'hashgraph/hedera-sdk-java',
  'hashgraph/hedera-sdk-go',
  'hashgraph/hedera-sdk-cpp',
  'hashgraph/solo'
];
const GOOD_FIRST_ISSUE_LABEL = 'good first issue';
const GOOD_FIRST_ISSUE_CANDIDATE_LABEL = 'good first issue candidate';


async function fetchIssuesByLabel(repo, label) {
  const labelEncoded = encodeURIComponent(label);
  const url = `https://api.github.com/repos/${repo}/issues?labels=${labelEncoded}&state=open`;

  try {
    const response = await fetch(url, { headers: HEADERS });
    if (!response.ok) {
      throw new Error(`Error fetching data from ${repo}: ${response.statusText}`);
    }

    const issues = await response.json();
    return issues.map(issue => ({
      title: issue.title,
      url: issue.html_url,
      created_at: issue.created_at,
      repo: repo,
      label: label
    }));
  } catch (error) {
    console.error(`Error fetching from ${repo}:`, error);
    return [];
  }
}

async function fetchIssues(repos, label, name) {
  const issues = [];
  for (const repo of repos) {
    issues.push(...await fetchIssuesByLabel(repo, label));
  }
  writeFileSync('./../data/'+ name + '.json', JSON.stringify(issues, null, 2));
  console.log('Done: ' + name);
}

async function main() {
  await fetchIssues(OPEN_ELEMENTS_REPOS, GOOD_FIRST_ISSUE_LABEL, 'goodFirstIssuesForOpenElements');
  await fetchIssues(OPEN_ELEMENTS_REPOS, GOOD_FIRST_ISSUE_CANDIDATE_LABEL, 'goodFirstIssueCandidatesForOpenElements');
  await fetchIssues(HEDERA_REPOS, GOOD_FIRST_ISSUE_LABEL, 'goodFirstIssuesForHedera');
  await fetchIssues(HEDERA_REPOS, GOOD_FIRST_ISSUE_CANDIDATE_LABEL, 'goodFirstIssueCandidatesForHedera');
  console.log('Issues successfully saved!');
}

main();