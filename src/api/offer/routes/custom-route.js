module.exports = {
  routes: [
    {
      method: "DELETE",
      path: "/offers/delete-all/:id",
      handler: "offer.deleteAll",
    },
  ],
};
