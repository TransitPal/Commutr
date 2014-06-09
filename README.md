
###To Install
1. Make sure you have node.js installed, and run 
   ```
   npm install -g bower
   ```
2. To build a working copy of the app, you will need to have the Android SDK installed,
which requires the Java Development Kit.

3. Fork the repo, then 
   ```
   git clone https://github.com/[YOUR USERNAME]/Commutr/
   ```
4. cd to the root of your repo, and 
   ```
   npm install
   ```
5. cd to the client folder, and 
   ```
   bower install
   ```
6. For development, run ```mongod``` from the root folder.
When you're ready to build, run ```gulp buildAnd```

###File guide
1. Build tasks - /gulpfile.js
2. Client side logic - /client/www/js
3. HTML templates - /client/index.html
                 - /client/www/templates
4. Server logic - /server

###Contributors Guide

1. Fork TransitPal/Commutr to contribute
2. Add upstream remote
    ```
    git remote add upstream https://github.com/TransitPal/Commutr.git
    ```

3. Before pushing to personal fork*:
    ```
    git pull --rebase upstream dev
    ```

4. Push to personal fork:
    ```
    git push origin master
    ```

5. Submit pull request to TransitPal/Commutr dev branch.  Dev branch is used as a staging area for new features. Master branch will always be the official working release, as it is auto-deployed to commutr.azurewebsites.net.


\* Rebase from upstream dev is also required after every new feature announcement


###Resolving Pull Requests

1. One team member (other than the contributor) will be selected to do a code review
2. Upon approval run these commands from the official clone:
    ```
    git checkout -b test-branch dev

    git pull git@github.com:<YOUR_REPO_URL> master

    git checkout dev

    git rebase test-branch
    
    git push origin master
    ```


###Style Guide

Keep all commits in present tense (e.g. 'implements', 'creates', 'adds').

Do not use a period at the end of commit messages.

Extensive style guide found [here](https://github.com/hackreactor/curriculum/wiki/Style-Guide).
