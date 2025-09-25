/* import { db } from '@/lib/db';

export default async function UsersPage() {
  try {
    const { rows: users } = await db.query('SELECT * FROM usuario');    
    type User = {
      id: number;
      nombre: string;
      email: string;      
    };

    return (
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">Usuarios Registrados</h1>
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-6 text-left">ID</th>
                <th className="py-3 px-6 text-left">Nombre</th>
                <th className="py-3 px-6 text-left">Email</th>                
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {users.map((user: User) => (
                <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6">{user.id}</td>
                  <td className="py-3 px-6">{user.nombre}</td>
                  <td className="py-3 px-6">{user.email}</td>                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && <p className="mt-4 text-center text-gray-500">No se encontraron usuarios.</p>}
      </div>
    );
  } catch (error) {
    console.error('Error fetching users:', error);    
    return (
      <div className="container mx-auto p-8 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-bold mb-4 text-red-600">Error al Cargar Usuarios</h1>
        <p className="text-lg text-gray-600">Hubo un problema al conectar con la base de datos.</p>
        <p className="text-md text-gray-500 mt-2">Por favor, revisa la consola del servidor para más detalles técnicos y asegúrate de que la base de datos esté funcionando.</p>
      </div>
    );
  }
} */
