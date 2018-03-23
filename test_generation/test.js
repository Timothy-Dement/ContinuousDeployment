const request = require('request');

// 'GET' CALLS

request( { url: 'http://localhost/api/study/vote/status', method: 'GET', qs: { fingerprint: 'fingerprint', studyId: '000000000000000000000000' } }, function(error, response, body) { } );
request( { url: 'http://localhost/api/study/vote/status', method: 'GET' }, function(error, response, body) { } );
request( { url: 'http://localhost/api/study/listing', method: 'GET' }, function(error, response, body) { } );

// 'GET' CALLS WITH IDS

request( { url: 'http://localhost/api/study/load/000000000000000000000000', method: 'GET' }, function(error, response, body) { } );
request( { url: 'http://localhost/api/study/status/000000000000000000000000', method: 'GET' }, function(error, response, body) { } );

// 'GET' CALLS WITH TOKENS

request( { url: 'http://localhost/api/study/admin/token_zero', method: 'GET' }, function(error, response, body) { } );
request( { url: 'http://localhost/api/study/admin/token_one', method: 'GET' }, function(error, response, body) { } );
request( { url: 'http://localhost/api/study/admin/token_two', method: 'GET' }, function(error, response, body) { } );
request( { url: 'http://localhost/api/study/admin/token_three', method: 'GET' }, function(error, response, body) { } );
request( { url: 'http://localhost/api/study/admin/download/token_zero', method: 'GET' }, function(error, response, body) { } );
request( { url: 'http://localhost/api/study/admin/download/token_one', method: 'GET' }, function(error, response, body) { } );
request( { url: 'http://localhost/api/study/admin/download/token_two', method: 'GET' }, function(error, response, body) { } );
request( { url: 'http://localhost/api/study/admin/download/token_three', method: 'GET' }, function(error, response, body) { } );
request( { url: 'http://localhost/api/study/admin/assign/token_four', method: 'GET' }, function(error, response, body) { } );
request( { url: 'http://localhost/api/study/admin/assign/token_zero', method: 'GET' }, function(error, response, body) { } );
request( { url: 'http://localhost/api/study/admin/assign/token_one', method: 'GET' }, function(error, response, body) { } );
request( { url: 'http://localhost/api/study/admin/assign/token_two', method: 'GET' }, function(error, response, body) { } );
request( { url: 'http://localhost/api/study/admin/assign/token_three', method: 'GET' }, function(error, response, body) { } );

// 'POST' CALLS

request( { url: 'http://localhost/api/design/survey', method: 'POST', json: { markdown: '{}\n---\n# Test' } }, function(error, response, body) { } );
request( { url: 'http://localhost/api/study/create', method: 'POST', json: { invitecode: '' } }, function(error, response, body) { } );
request( { url: 'http://localhost/api/study/create', method: 'POST', json: { name: 'Created Survey', description: 'Description for created survey.', studyKind: 'survey', researcherName: 'John Smith', contact: 'test@test.com', awards: [], invitecode: 'RESEARCH', markdown: '# Markdown', token: 'survey_token' } }, function(error, response, body) { } );
request( { url: 'http://localhost/api/study/create', method: 'POST', json: { name: 'Created Data Study', description: 'Description for created data study.', studyKind: 'dataStudy', researcherName: 'John Smith', contact: 'test@test.com', awards: [], invitecode: 'RESEARCH', markdown: '# Markdown', token: 'data_study_token' } }, function(error, response, body) { } );
request( { url: 'http://localhost/api/study/vote/submit/', method: 'POST', json: { studyId: '000000000000000000000005', fingerprint: 'fingerprint', answers: '[ { "kind": "single" } ]', email: 'test@test.com', contact: 'test@test.com' } }, function(error, response, body) { } );
request( { url: 'http://localhost/api/study/admin/open/', method: 'POST', json: { token : 'token_zero' } }, function(error, response, body) { } );
request( { url: 'http://localhost/api/study/admin/close/', method: 'POST', json: { token : 'token_zero' } }, function(error, response, body) { } );
request( { url: 'http://localhost/api/study/admin/notify/', method: 'POST', json: { email: '', kind: '' } }, function(error, response, body) { } );
request( { url: 'http://localhost/api/study/admin/notify/', method: 'POST', json: { email: 'test@test.com', kind: 'AMZN' } }, function(error, response, body) { } );
request( { url: 'http://localhost/api/study/admin/notify/', method: 'POST', json: { email: 'test@test.com', kind: 'SURFACE' } }, function(error, response, body) { } );
request( { url: 'http://localhost/api/study/admin/notify/', method: 'POST', json: { email: 'test@test.com', kind: 'IPADMINI' } }, function(error, response, body) { } );
request( { url: 'http://localhost/api/study/admin/notify/', method: 'POST', json: { email: 'test@test.com', kind: 'GITHUB' } }, function(error, response, body) { } );
request( { url: 'http://localhost/api/study/admin/notify/', method: 'POST', json: { email: 'test@test.com', kind: 'BROWSERSTACK' } }, function(error, response, body) { } );