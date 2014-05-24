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