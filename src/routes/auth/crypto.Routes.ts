import { Router } from "express";
// import PreKey from "../../db/mongo/models/preKey";
import Bundle from "../../db/mongo/models/bundle";



const router: Router = Router();

router.post("/:id", async (req, res, next) => {
  // {"identityKey":"","registrationId":12318,"preKeys":[],"signedPreKey":{}}

  // let preKeys: Array<any> = [];
  // for (const [index, preKey] of req.body?.preKeys?.entries()) {
  //   const p = await PreKey.create(preKey);
  //   preKeys.push(preKey)
  //   req.body.preKeys[index] = p.id;
  // }
  let bundle = await Bundle.findOne({ userId: req.params.id }).exec();
  if (!!bundle) {
    bundle.update({ $set: { ...req.body } })
  } else {
    bundle = await Bundle.create({ ...req.body, userId: req.params.id });
  }
  // req.body.preKeys = preKeys;
  return res.status(201).json({
    success: true,
    data: bundle
  })
})

router.get("/:id", async (req, res, next) => {
  const bundle = await Bundle.findOne({ userId: req.params.id }).exec();
  if (!bundle) return res.status(404);
  res.status(200).json({
    success: true,
    data: bundle
  })
})

router.patch("/:id", async (req, res, next) => {
  const bundle = await Bundle.findByIdAndUpdate(req.params.id, { $set: { ...req.body } }, { returnDocument: 'after' }).exec();
  if (!bundle) return res.status(404);
  res.status(200).json({
    success: true,
    data: bundle
  })
})

export default router;
