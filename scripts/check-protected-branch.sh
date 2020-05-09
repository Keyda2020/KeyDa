CURRENT_BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)

if [ $CURRENT_BRANCH_NAME = "develop" ] || [ $CURRENT_BRANCH_NAME = "master" ];
  then
    echo "push/commit is prevented in branch [$CURRENT_BRANCH_NAME].";
    exit 1; #Unsuccessful
else
  echo "pushed/commited successfully.";
  exit 0; #Successful
fi
