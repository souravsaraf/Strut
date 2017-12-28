What happens or what to do when u rename/edit a bundle name from (lets say) 'strut.log_button' to 'strut.logo_row'?

1. Make changes in the bundle itself (the references to the model , view and template files in that bundle) to complete the bundle itself.
   Example case : Make changes in the first few lines where dependencies are declared inside LogoView.js , LogoModel.js , LogoTemplate.bars files.

2. Change the folder name of the bundle.
   example case : rename folder from 'strut.log_button' to 'strut.logo_row').
   
3. Make changes used by other features which uses the feature whose name you are modifying. 
   Example case : HeaderView uses logo_button , hence we need to replace there also.

4. Makes changes to the references used in the main script (Strut/scripts/main.js).

5. Make changes to the features file (the file which lists all the features present in the app) (Strut/scripts/features.js).