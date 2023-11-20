const {
  RecaptchaEnterpriseServiceClient,
} = require("@google-cloud/recaptcha-enterprise");

/**
 * Create an assessment to analyze the risk of a UI action.
 *
 * projectID: Your Google Cloud Project ID.
 * recaptchaSiteKey: The reCAPTCHA key associated with the site/app
 * token: The generated token obtained from the client.
 * recaptchaAction: Action name corresponding to the token.
 */
exports.createAssessment = async ({
  // TODO: Replace the token and reCAPTCHA action variables before running the sample.
  projectID = "recaptcha-1700448243712",
  recaptchaKey = "6LdcNxUpAAAAAKywjiklDa2mhrZnLQFtBV2rPP5e",
  token = "action-token",
  recaptchaAction = "action-name",
}) => {
  // Create the reCAPTCHA client.
  // TODO: Cache the client generation code (recommended) or call client.close() before exiting the method.
  const client = new RecaptchaEnterpriseServiceClient();
  const projectPath = client.projectPath(projectID);

  // Build the assessment request.
  const request = {
    assessment: {
      event: {
        token: token,
        siteKey: recaptchaKey,
      },
    },
    parent: projectPath,
  };

  console.log(request);

  const [response] = await client.createAssessment(request);
  console.log(response);

  // Check if the token is valid.

  const { tokenProperties, riskAnalysis } = response.tokenProperties;

  const isValidToken = tokenProperties.valid;
  if (!isValidToken) {
    const invalidReason = tokenProperties.invalidReason;
    console.log(
      `The CreateAssessment call failed because the token was: ${invalidReason}`
    );
    return {
      riskAnalysis,
      isValid: false,
      invalidReason: tokenProperties.invalidReason,
    };
  }

  // Check if the expected action was executed.
  // The `action` property is set by user client in the grecaptcha.enterprise.execute() method.
  if (response.tokenProperties.action === recaptchaAction) {
    // Get the risk score and the reason(s).
    // For more information on interpreting the assessment, see:
    // https://cloud.google.com/recaptcha-enterprise/docs/interpret-assessment
    console.log(`The reCAPTCHA score is: ${response.riskAnalysis.score}`);
    response.riskAnalysis.reasons.forEach((reason) => {
      console.log(reason);
    });
    return {
      riskAnalysis,
      isValid: true,
      invalidReason: tokenProperties.invalidReason,
    };
  } else {
    console.log(
      "The action attribute in your reCAPTCHA tag does not match the action you are expecting to score"
    );
    return {
      riskAnalysis,
      isValid: false,
      invalidReason: tokenProperties.invalidReason,
    };
  }
};
