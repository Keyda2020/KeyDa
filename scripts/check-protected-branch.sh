CURRENT_BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)

if [ $CURRENT_BRANCH_NAME = "develop" ] || [ $CURRENT_BRANCH_NAME = "master" ];
  then
    echo "committing or pushing is prevented in branch [$CURRENT_BRANCH_NAME].";
    exit 1; #Unsuccessful
else
  echo "successfully commited.";
  exit 0; #Successful
fi
