module.exports = async (policyContext, config, { strapi }) => {
  const userId = policyContext.state.user.id;
  const offerId = policyContext.request.params.id;

  const offer = await strapi.entityService.findOne(
    "api::offer.offer",
    offerId,
    { populate: ["owner"] }
  );

  console.log(userId);

  if (userId !== offer.owner.id) {
    return false;
  } else {
    return true;
  }
};
