/**
 * -----------------------------------------------------------------------------
 * GENERIC MIDDLEWARE FACTORY (SINGLE RESOURCE)
 * -----------------------------------------------------------------------------
 * Creates a middleware to verify ownership for a single resource.
 *
 * Config Options:
 * - checkFunction (async fn): The DB function to call (e.g., checkCarOwnership)
 * - resourceName (string): Singular name (e.g., "car", "review")
 * - isOwner (boolean): true = user must be owner, false = user must NOT be owner
 * - idSource ('params' | 'body'): Where to look for the ID
 * - idKeys (string[]): Array of keys to check for the ID (e.g., ['id', 'carId'])
 * - errorMsg (string): The 403 error message
 */
const createOwnershipVerifier = (config) => {
  const { checkFunction, resourceName, isOwner, idSource, idKeys, errorMsg } =
    config;

  return async (req, res, next) => {
    try {
      let resourceId;
      if (req[idSource]) {
        for (const key of idKeys) {
          if (req[idSource][key]) {
            resourceId = req[idSource][key];
            break;
          }
        }
      }

      const userId = req.user.id;

      if (!resourceId) {
        return res
          .status(400)
          .json({ error: `${resourceName} ID is required` });
      }

      const resource = await checkFunction(userId, resourceId);

      if (!resource) {
        return res.status(404).json({ error: `${resourceName} not found` });
      }

      const isAuthorized = isOwner ? resource.can_modify : !resource.can_modify;

      if (!isAuthorized) {
        return res.status(403).json({ error: errorMsg });
      }

      req[resourceName] = resource; // Attach to req (e.g., req.car, req.review)
      next();
    } catch (error) {
      console.error(`${resourceName} ownership verification error:`, error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
};

/**
 * -----------------------------------------------------------------------------
 * GENERIC MIDDLEWARE FACTORY (MULTIPLE RESOURCES)
 * -----------------------------------------------------------------------------
 * Creates a middleware to verify ownership for multiple resources from req.body.
 *
 * Config Options:
 * - checkFunction (async fn): The DB function to call (e.g., checkCarOwnership)
 * - resourceName (string): Plural name (e.g., "cars", "reviews")
 * - isOwner (boolean): true = user must be owner, false = user must NOT be owner
 * - idKey (string): The key in req.body holding the ID array (e.g., 'carIds')
 * - idProperty (string): The primary key on the resource object (e.g., 'ID_Car')
 * - errorMsg (string): The 403 error message
 */
const createMultipleOwnershipVerifier = (config) => {
  const { checkFunction, resourceName, isOwner, idKey, idProperty, errorMsg } =
    config;

  return async (req, res, next) => {
    try {
      const resourceIds = req.body[idKey];
      const userId = req.user.id;

      if (!Array.isArray(resourceIds) || resourceIds.length === 0) {
        return res.status(400).json({ error: `${idKey} array is required` });
      }

      const resourceChecks = await Promise.all(
        resourceIds.map((id) => checkFunction(userId, id)),
      );

      const notFound = resourceChecks.filter((item) => !item);
      if (notFound.length > 0) {
        return res.status(404).json({ error: "One or more items not found" });
      }

      const unauthorized = resourceChecks.filter((item) => {
        return isOwner ? !item.can_modify : item.can_modify;
      });

      if (unauthorized.length > 0 && req.user.role !== "admin") {
        return res.status(403).json({
          error: errorMsg,
          unauthorizedIds: unauthorized.map(
            (item) => item[idProperty], // Use dynamic ID property
          ),
        });
      }

      req[resourceName] = resourceChecks; // Attach to req (e.g., req.cars)
      next();
    } catch (error) {
      console.error(
        `Multiple ${resourceName} ownership verification error:`,
        error,
      );
      res.status(500).json({ error: "Internal server error" });
    }
  };
};

module.exports = {
  createOwnershipVerifier,
  createMultipleOwnershipVerifier,
};
