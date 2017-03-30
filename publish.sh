rm index.zip
cd lambda
zip –X –r ../index.zip *
cd ..
aws lambda update-function-code --function-name YOUR_LAMBDA_FUNCTION_NAME --zip-file fileb://index.zip
