export function deleteRestaurant(mysqlCon,restaurantId: number): Promise<void> {
    const deleteQuery = "DELETE FROM restaurante WHERE id_restaurante=?";
    return new Promise((resolve, reject) => {
      mysqlCon.query(deleteQuery, [restaurantId], (err, results) => {
        if (err) {
          reject(err);
        }
      });
    });
}