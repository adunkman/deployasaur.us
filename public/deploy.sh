#!/bin/bash
blue=$(tput setaf 4)
green=$(tput setaf 2)
yellow=$(tput setaf 3)
red=$(tput setaf 1)
reset=$(tput sgr0)

function print() {
  echo "${blue}http://deployasaur.us:${reset} $1"
}

[[ $(git remote -v) =~ git://github.com/([^ ]+).git ]]
repository=${BASH_REMATCH[1]}
branch=$TRAVIS_BRANCH
build=$TRAVIS_BUILD_NUMBER
job=$TRAVIS_JOB_NUMBER
id=$TRAVIS_BUILD_ID

if [[ $TRAVIS_PULL_REQUEST != "false" ]]; then
  print "woah there! dinosaurs never deploy pull requests."
  print "${yellow}exiting without deploying.${reset}"
  exit
fi

if [[ $TRAVIS_TEST_RESULT != "0" ]]; then
  print "woah there! your tests didn't pass!"
  print "${yellow}exiting without deploying.${reset}"
  exit
fi

print "howdy $repository $branch build $build! nice to hear from you."
print "checking in with the dinosaur overlords..."

url="http://www.deployasaur.us/$repository/$branch/$build/script?job=${job}&id=${id}"
status=$(curl -s $url -o response -w %{http_code})

case $status in
  200)
    print "running your deployment script..."
    chmod a+x response
    echo ""
    ./response
    code=$?
    echo ""

    if [ $code -eq 0 ]; then
      print "${green}your deployment script has finished successfully (exit code $code).${reset}"
      print "thankful? tweet @adunkman mentioning #deployasaurus"
    else
      print "${red}your deployment script failed (exit code $code).${reset}"
      print "this is probably not an issue with deployasaur.us."
    fi

    print "reporting deployment status..."
    url="http://www.deployasaur.us/$repository/$branch/$build/status?job=${job}"
    status=$(curl -X PUT -d "code=$code" -s $url -o reportStatus -w %{http_code})

    if [ $status -eq 200 ]; then
      print "all done!"
    else
      print "${red}couldn't report deployment status: something strange happened (status $status).${reset}"
      print "${red}response for debugging purposes:${reset}"
      echo ""
      echo $(cat reportStatus)
      echo ""
      print "${red}please file an issue with this complete output${reset}"
      print "${red}issues url: http://github.com/adunkman/deployasaur.us/issues${reset}"
    fi

    ;;
  202)
    print "${yellow}other jobs must check-in before deployment occurs.${reset}"
    print "$(cat response)"
    print "${yellow}exiting without deploying.${reset}"
    ;;
  404)
    print "${red}i don't know about this repository and branch.${reset}"
    print "${red}are you sure you've created a deployment script for $repository/$branch?${reset}"
    print "${yellow}exiting without deploying.${reset}"
    ;;
  *)
    print "${red}something strange happened (status $status).${reset}"
    print "${red}response for debugging purposes:${reset}"
    echo ""
    echo $(cat response)
    echo ""
    print "${red}please file an issue with this complete output${reset}"
    print "${red}issues url: http://github.com/adunkman/deployasaur.us/issues${reset}"
    print "${yellow}exiting without deploying.${reset}"
    ;;
esac

print "bye now!"