
// Prototype
import { ReclaimClient } from '@reclaimprotocol/js-sdk';

  const getVerificationReq = async () => {
  const APP_ID = "0xf8C8bDE8BF1100C6AF9d0f34b24becA88CeC5399";
  const APP_SECRET ="0xdea76dc6d6a8c1ee80aeba950f6f5f309aa51da4bbcf35d93dac2360f0e1b6f0" // do not store on frontend in production


  const reclaimClient = new ReclaimClient(APP_ID);

  const providers = [
  '1bba104c-f7e3-4b58-8b42-f8c0346cdeab', // Steam ID
  ];

  const providerV2 = await reclaimClient.buildHttpProviderV2ByID(providers);
  const requestProofs = reclaimClient.buildRequestedProofs(providerV2, reclaimClient.getAppCallbackUrl());

  reclaimClient.setSignature(await reclaimClient.getSignature(requestProofs,APP_SECRET))

  const reclaimReq = await reclaimClient.createVerificationRequest(providers);
  console.log('req', reclaimReq.template);
  const url = await reclaimReq.start();
  console.log(url);

  reclaimReq.on('success', (data) => {
    if (data) {
      const proofs = data;
      console.log(proofs);
    }
  });

  reclaimReq.on('error', (data) => {
    if (data) {
      const proofs = data;
      // TODO: update business logic based on proof generation failure
    }
  });
};


// call when user clicks on a button
// onClick={getVerificationReq}
