import { getDatabase, onValue, ref, set } from 'firebase/database';
import { IList } from '../interfaces/list.interface';
import { db } from '../services/firebase.service';

function writeUserData(userId: string, data: IList[]) {
  console.log('save to database', data);

  set(ref(db, 'users/' + userId), {
    data,
  })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
}

export { writeUserData };
