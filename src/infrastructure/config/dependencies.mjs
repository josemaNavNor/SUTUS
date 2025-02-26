
//Repositorios
import UserRepositoryImpl from '../../infrastructure/repositories/userRepositoryImpl.mjs';
import employeeRepositoryImpl from '../../infrastructure/repositories/employeeRepositoryImpl.mjs';
import departmentRepositoryImpl from '../repositories/departamentoRepositoryImpl.mjs';
import rolRepositoryImpl from '../repositories/rolRepositoryImpl.mjs';
import benefitrequestsRepositoryImpl from '../repositories/benefit_requestsRepositoryImpl.mjs';
import adminRepositoryImpl from '../repositories/adminRepositoryImpl.mjs';

//Casos de uso del usuario
import Updatepassword from '../../application/usecases/userUsecases/updatePassword.mjs';
import UpdateEmail from '../../application/usecases/userUsecases/updateEmail.mjs';
import createRequest from '../../application/usecases/userUsecases/createRequest.mjs';
import AuthUseCase from '../../application/usecases/userUsecases/authUseCase.mjs';
import listRequests from '../../application/usecases/userUsecases/listRequests.mjs';
import updateRequest from '../../application/usecases/userUsecases/updateRequest.mjs';
import RefreshTokenUseCase from '../../application/usecases/userUsecases/refreshTokenUseCase.mjs';

//Casos de uso del administrador
import AssingUserRole from '../../application/usecases/adminUsecases/AssignUserRole.mjs'
import uploadFileRegulations from '../../application/usecases/adminUsecases/UploadFileRegulations.mjs';
import manageEmployee from '../../application/usecases/adminUsecases/manageEmployee.mjs'
import ManageRequests from '../../application/usecases/adminUsecases/manageRequests.mjs';
import ManageBenefits from '../../application/usecases/adminUsecases/manageBenefits.mjs';
import ManageDeparment from '../../application/usecases/adminUsecases/manageDeparment.mjs';
import ManageRole from '../../application/usecases/adminUsecases/manageRoles.mjs';

//Servicios
import HashService from '../../application/services/HashService.mjs';
import UsernameGeneratorService from '../../application/services/UsernameGeneratorService.mjs';
import DateFormatterService from '../../application/services/dateFormatterService.mjs'
import PythonExecutorService from '../services/PythonExecutorService.mjs';
import JwtService from '../../application/services/jswtService.mjs';
import RefreshTokenService from '../../application/services/refreshTokenService.mjs';

//Controladores
import EmployeeController from '../../interfaces/controllers/employeeController.mjs';
import UserController from '../../interfaces/controllers/userController.mjs';
import departmentController from '../../interfaces/controllers/departmentController.mjs';
import rolController from '../../interfaces/controllers/rolController.mjs';
import benefitrequestsControllerr from '../../interfaces/controllers/benefitrequestsController.mjs';
import adminController from '../../interfaces/controllers/adminController.mjs';


const configureDependencies = () => {

    const userRepository = new UserRepositoryImpl();
    const employeeRepository = new employeeRepositoryImpl();
    const departmentRepository = new departmentRepositoryImpl();
    const rolRepository = new rolRepositoryImpl();
    const benefitrequest = new benefitrequestsRepositoryImpl();
    const adminRepository = new adminRepositoryImpl();

    //Servicios
    const hashService = new HashService();
    const usernameGeneratorService = new UsernameGeneratorService(userRepository);
    const dateFormatter = new DateFormatterService();
    const pythonexecService = new PythonExecutorService();
    const jwtService = new JwtService();
    const refreshJWTService = new RefreshTokenService();

    //Casos de uso del usuario
    const updatePassword = new Updatepassword(userRepository);
    const Updateemail = new UpdateEmail(userRepository);
    const CreateRequest = new createRequest(userRepository);
    const authenticate = new AuthUseCase(userRepository, hashService, jwtService, refreshJWTService);
    const findRequests = new listRequests(userRepository, dateFormatter);
    const updateRequestUser = new updateRequest(userRepository);
    const refreshJWT = new RefreshTokenUseCase(refreshJWTService);

    //Casos de uso para gestionar el empleado
    const Manageemployee = new manageEmployee(
        userRepository,
        employeeRepository,
        hashService,
        usernameGeneratorService
    );

    //Casos de uso del departamento
    const manageDeparment = new ManageDeparment(
        departmentRepository
    )

    //Casos de uso del rol
    const manageRol = new ManageRole(rolRepository);

    //Casos de uso de las solicitudes de prestaciones
    const manageBenefits = new ManageBenefits(
        benefitrequest
    )

    //Casos de uso del administrador
    const manageRequests = new ManageRequests(
        adminRepository,
        dateFormatter
    )

    const assingURole = new AssingUserRole(
        adminRepository
    )

    const uploadRegulations = new uploadFileRegulations(
        pythonexecService
    )

    //Controlador del usuario
    const userController = new UserController(CreateRequest, authenticate, updatePassword, Updateemail,findRequests, updateRequestUser, refreshJWT);

    //Controlador del empleado
    const employeeController = new EmployeeController(Manageemployee);

    //Controlador del departamento
    const Departmentcontroller = new departmentController(manageDeparment);

    //Controlador del rol
    const Rolcontroller = new rolController(manageRol);

    //Controlador de las prestaciones
    const BenefitrequestsController = new benefitrequestsControllerr(manageBenefits);

    //Controlador del administrador
    const AdminController = new adminController(manageRequests, assingURole, uploadRegulations)

    return {
        userController,
        employeeController,
        Departmentcontroller,
        Rolcontroller,
        BenefitrequestsController,
        AdminController
    };
};

export default configureDependencies;