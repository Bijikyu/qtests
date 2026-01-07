#!/usr/bin/env node
import fs from'fs';
import path from'path';
import{fileURLToPath}from'url';
import qerrors from'qerrors';

const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
const DEFAULT_CONFIG={outputPath:'./security-report.md',failOnVulnerabilities:true,includePenetrationTests:false,generateMetrics:true,coverageThreshold:95};

class SecurityTestRunner{
  constructor(config={}){this.config={...DEFAULT_CONFIG,...config};this.results=[];this.startTime=0;}
  
  async runSecurityTests(){
    this.startTime=Date.now();
    console.log('🔒 Starting QTests Security Test Suite');
    console.log(`📊 Configuration: ${JSON.stringify(this.config,null,2)}`);
    console.log('');
    try{
      await this.runRegressionTests();
      if(this.config.includePenetrationTests){await this.runPenetrationTests();}
      await this.validateSecurityConfigurations();
      if(this.config.generateMetrics){await this.generateSecurityMetrics();}
      await this.generateSecurityReport();
      this.checkForFailures();
      console.log('');
      console.log('✅ Security testing completed successfully');
    }catch(error){
      console.error('❌ Security testing failed:',error);
      try{
        const qerrors=await import('qerrors');
        if(qerrors.default){
          qerrors.default(error instanceof Error?error:new Error('Security test execution failed'),'qtests.security.test_runner',{config:this.config,error:String(error)});
        }
      }catch(importError){
        console.error('Failed to import qerrors:',importError);
        console.error('Security test execution failed:',error);
      }
      process.exit(1);
    }
  }
  
  async runRegressionTests(){
    console.log('🧪 Running security regression tests...');
    const{runFullSecurityTest}=await import('../lib/security/SecurityTestingFramework.js');
    const results=runFullSecurityTest();
    this.results.push({type:'regression_tests',timestamp:new Date().toISOString(),results,summary:{total:results.length,passed:results.filter(r=>r.passed).length,failed:results.filter(r=>r.passed===false).length,vulnerabilities:results.reduce((sum,r)=>sum+r.vulnerabilities.length,0)}});
    console.log(`   ✓ Ran ${results.length} regression tests`);
    console.log(`   ✓ Passed: ${results.filter(r=>r.passed).length}`);
    console.log(`   ✓ Failed: ${results.filter(r=>r.passed===false).length}`);
  }
  
  async runPenetrationTests(){
    console.log('🎯 Running penetration tests...');
    const{penetrationTester}=await import('../lib/security/SecurityTestingFramework.js');
    const penetrationResults=[penetrationTester.testXSS('{{payload}}'),penetrationTester.testSQLInjection('SELECT * FROM users WHERE id = "{{param}}"'),penetrationTester.testPathTraversal('/files/{{path}}'),penetrationTester.testCommandInjection('ls {{arg}}')];
    this.results.push({type:'penetration_tests',timestamp:new Date().toISOString(),results:penetrationResults,summary:{total:penetrationResults.length,passed:penetrationResults.filter(r=>r.passed).length,failed:penetrationResults.filter(r=>r.passed===false).length,vulnerabilities:penetrationResults.reduce((sum,r)=>sum+r.vulnerabilities.length,0)}});
    console.log(`   ✓ Ran ${penetrationResults.length} penetration tests`);
    console.log(`   ✓ Passed: ${penetrationResults.filter(r=>r.passed).length}`);
    console.log(`   ✓ Failed: ${penetrationResults.filter(r=>r.passed===false).length}`);
  }
  
  async validateSecurityConfigurations(){
    console.log('⚙️ Validating security configurations...');
    const validationResults=[];
    const{securityPolicyManager,securityValidator,securityMonitor}=await import('../lib/security/index.js');
    const headers=securityPolicyManager.generateSecurityHeaders();
    const headerValidation=securityPolicyManager.validateSecurityHeaders(headers);
    validationResults.push({type:'security_headers',passed:headerValidation.valid,details:headerValidation.errors,headers:Object.keys(headers).length});
    const ruleSets=securityValidator.getRuleSets();
    validationResults.push({type:'validation_rules',passed:ruleSets.length>0,details:ruleSets,ruleCount:ruleSets.length});
    securityMonitor.checkRateLimit('test-validation',{windowMs:1000,maxRequests:1});
    const metrics=securityMonitor.getSecurityMetrics();
    validationResults.push({type:'security_monitoring',passed:metrics.totalEvents>=0,details:metrics,eventsCount:metrics.totalEvents});
    this.results.push({type:'configuration_validation',timestamp:new Date().toISOString(),results:validationResults,summary:{total:validationResults.length,passed:validationResults.filter(r=>r.passed).length,failed:validationResults.filter(r=>r.passed===false).length}});
    console.log(`   ✓ Validated ${validationResults.length} security configurations`);
    console.log(`   ✓ Passed: ${validationResults.filter(r=>r.passed).length}`);
    console.log(`   ✓ Failed: ${validationResults.filter(r=>r.passed===false).length}`);
  }
  
  async generateSecurityMetrics(){
    console.log('📈 Generating security metrics...');
    const{securityMonitor}=await import('../lib/security/index.js');
    const metrics=securityMonitor.getSecurityMetrics();
    this.results.push({type:'security_metrics',timestamp:new Date().toISOString(),metrics,executionTime:Date.now()-this.startTime});
    console.log(`   ✓ Generated security metrics`);
    console.log(`   ✓ Total events: ${metrics.totalEvents}`);
    console.log(`   ✓ Active rate limits: ${metrics.rateLimitStats.activeLimits}`);
  }
  
  async generateSecurityReport(){
    console.log('📝 Generating security report...');
    const reportContent=this.generateReportContent();
    const outputPath=path.resolve(this.config.outputPath||'./security-report.md');
    const outputDir=path.dirname(outputPath);
    if(!fs.existsSync(outputDir)){fs.mkdirSync(outputDir,{recursive:true});}
    fs.writeFileSync(outputPath,reportContent,'utf8');
    console.log(`   ✓ Report saved to: ${outputPath}`);
  }
  
  generateReportContent(){
    const now=new Date().toISOString();
    const executionTime=Date.now()-this.startTime;
    const totalTests=this.results.reduce((sum,result)=>sum+(result.results?.length||result.summary?.total||0),0);
    const totalPassed=this.results.reduce((sum,result)=>sum+(result.summary?.passed||0),0);
    const totalFailed=this.results.reduce((sum,result)=>sum+(result.summary?.failed||0),0);
    const totalVulnerabilities=this.results.reduce((sum,result)=>sum+(result.summary?.vulnerabilities||0),0);
    const successRate=totalTests>0?((totalPassed/totalTests)*100).toFixed(1):'0.0';
    const coverageStatus=(parseFloat(successRate)>=(this.config.coverageThreshold||95))?'✅':'❌';
    const reportPart1=['# QTests Security Test Report','',`**Generated:** ${now}`,`**Execution Time:** ${executionTime}ms`,`**Coverage Threshold:** ${this.config.coverageThreshold}%`,`**Actual Coverage:** ${successRate}% ${coverageStatus}`,'','## Executive Summary','',`This security test suite ran **${totalTests}** tests with a **${successRate}%** pass rate. `,`**${totalVulnerabilities}** vulnerabilities were identified across all test categories.`,'','### Test Results Overview','', '| Category | Total | Passed | Failed | Vulnerabilities |', '|----------|-------|--------|--------|----------------|'];
    const tableRows=this.results.map(result=>{const summary=result.summary||{};const category=result.type.replace(/_/g,' ').replace(/\b\w/g,l=>l.toUpperCase());return `| ${category} | ${summary.total||0} | ${summary.passed||0} | ${summary.failed||0} | ${summary.vulnerabilities||0} |`;});
    const criticalSection=['','### Critical Issues','', totalVulnerabilities>0?`❌ **${totalVulnerabilities}** vulnerabilities detected. Immediate attention required.`:'✅ No critical vulnerabilities detected.'];
    const detailSection=['','## Detailed Results','', ...this.results.map(result=>this.generateCategorySection(result))];
    const recommendSection=['','## Security Recommendations','',this.generateRecommendations()];
    const configSection=['','## Configuration','', '### Test Configuration','```json',JSON.stringify(this.config,null,2),'```','', '### Security Metrics','', '```json',JSON.stringify(this.results.find(r=>r.type==='security_metrics')?.metrics||{},null,2),'```'];
    return[...reportPart1,...tableRows,...criticalSection,...detailSection,...recommendSection,...configSection,'','---','', '*This report was generated automatically by QTests Security Test Runner.*'].join('\n');
  }
  
  generateCategorySection(result){
    const category=result.type.replace(/_/g,' ').replace(/\b\w/g,l=>l.toUpperCase());
    const sections=[`### ${category}`,'',`**Timestamp:** ${result.timestamp}`,'','#### Summary',`- Total Tests: ${result.summary?.total||0}`,`- Passed: ${result.summary?.passed||0}`,`- Failed: ${result.summary?.failed||0}`,`- Vulnerabilities: ${result.summary?.vulnerabilities||0}`,''];
    if(result.results&&result.results.length>0){
      sections.push('#### Test Details');
      sections.push('');
      result.results.forEach(test=>{
        const status=test.passed?'✅ PASSED':'❌ FAILED';
        sections.push(`**${test.description}** - ${status}`);
        if(!test.passed){
          if(test.vulnerabilities.length>0){
            sections.push('- Vulnerabilities:');
            test.vulnerabilities.forEach(vuln=>{sections.push(`  - ${vuln}`);});
          }
          if(test.recommendations.length>0){
            sections.push('- Recommendations:');
            test.recommendations.forEach(rec=>{sections.push(`  - ${rec}`);});
          }
        }
        sections.push('');
      });
    }
    return sections;
  }
  
  generateRecommendations(){
    const allVulnerabilities=new Set();
    this.results.forEach(result=>{
      if(result.results){
        result.results.forEach(test=>{
          if(test.vulnerabilities&&Array.isArray(test.vulnerabilities)){
            test.vulnerabilities.forEach(vuln=>allVulnerabilities.add(vuln));
          }
        });
      }
    });
    const recommendations=[];
    if(allVulnerabilities.size>0){
      recommendations.push('**Immediate Actions Required:**');
      recommendations.push('');
      recommendations.push('1. Address all identified vulnerabilities before deployment');
      recommendations.push('2. Review and update security configurations');
      recommendations.push('3. Implement additional input validation');
      recommendations.push('4. Strengthen security monitoring and alerting');
      recommendations.push('5. Schedule regular security assessments');
    }else{
      recommendations.push('✅ No immediate security actions required');
    }
    recommendations.push('');
    recommendations.push('**Ongoing Security Practices:**');
    recommendations.push('');
    recommendations.push('- Run security tests in CI/CD pipeline');
    recommendations.push('- Monitor security events continuously');
    recommendations.push('- Keep dependencies updated');
    recommendations.push('- Review security configurations regularly');
    recommendations.push('- Conduct periodic penetration testing');
    return recommendations.join('\n');
  }
  
  checkForFailures(){
    const totalVulnerabilities=this.results.reduce((sum,result)=>sum+(result.summary?.vulnerabilities||0),0);
    const totalFailed=this.results.reduce((sum,result)=>sum+(result.summary?.failed||0),0);
    const successRate=this.results.reduce((sum,result)=>sum+(result.summary?.passed||0),0)/this.results.reduce((sum,result)=>sum+(result.summary?.total||0),0)*100;
    const belowThreshold=successRate<(this.config.coverageThreshold||95);
    if(this.config.failOnVulnerabilities&&(totalVulnerabilities>0||totalFailed>0||belowThreshold)){
      console.log('');
      console.log('❌ Security tests failed - exiting with error code');
      console.log(`   - Vulnerabilities: ${totalVulnerabilities}`);
      console.log(`   - Failed Tests: ${totalFailed}`);
      console.log(`   - Coverage: ${successRate.toFixed(1)}% (required: ${this.config.coverageThreshold}%)`);
      process.exit(1);
    }
  }
}

async function main(){
  const args=process.argv.slice(2);
  const config={};
  for(let i=0;i<args.length;i++){
    switch(args[i]){
      case'--output':case'-o':config.outputPath=args[++i];break;
      case'--no-fail':config.failOnVulnerabilities=false;break;
      case'--penetration':case'-p':config.includePenetrationTests=true;break;
      case'--no-metrics':config.generateMetrics=false;break;
      case'--threshold':case'-t':config.coverageThreshold=parseInt(args[++i]);break;
      case'--help':case'-h':console.log(`\nQTests Security Test Runner\n\nUsage: node security-test-runner.js [options]\n\nOptions:\n  -o, --output <path>      Output report file path (default: ./security-report.md)\n  --no-fail               Don't exit with error code on vulnerabilities\n  -p, --penetration        Include penetration tests\n  --no-metrics             Don't generate security metrics\n  -t, --threshold <num>    Security test coverage threshold (default: 95)\n  -h, --help              Show this help message\n\nExamples:\n  node security-test-runner.js\n  node security-test-runner.js --output ./reports/security.md --penetration\n  node security-test-runner.js --threshold 90 --no-fail\n        `);process.exit(0);
      default:console.error(`Unknown option: ${args[i]}`);console.error('Use --help for available options');process.exit(1);
    }
  }
  const runner=new SecurityTestRunner(config);
  await runner.runSecurityTests();
}

if(import.meta.url===`file://${process.argv[1]}`){main().catch(error=>{console.error('Security test runner failed:',error);process.exit(1);});}
export{SecurityTestRunner};