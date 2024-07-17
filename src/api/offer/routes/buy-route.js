module.exports = {
  routes: [
    {
      method: "POST",
      path: "/offers/payment/:id",
      handler: "offer.payment",
    },
  ],
};
