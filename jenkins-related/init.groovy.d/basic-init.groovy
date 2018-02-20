///////////////////////////////////////////////////////////////////////
import hudson.model.*
import jenkins.security.*
//j.jenkins.setSecurityRealm(j.createDummySecurityRealm());        
User u = User.get("jenkins")  
ApiTokenProperty t = u.getProperty(ApiTokenProperty.class)  
def token = t.getApiTokenInsecure()
// Defining a file handler/pointer to handle the file.
// Check if a file with same name exisits in the folder.
System.out.println("JENKINS_PASS=$token")
////////////////////////////////////////////////////////////////////////


