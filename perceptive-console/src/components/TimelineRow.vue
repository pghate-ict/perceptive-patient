<template>
    <div>
        <v-flex md12 sm12>
            <v-layout row wrap>
                <v-flex md1 sm1></v-flex> <!-- Authority -->
                <v-flex md1 sm1></v-flex> <!-- Likability -->
                <v-flex md1 sm1></v-flex> <!-- Compassion -->
                <v-flex md2 sm2> <!-- Videos-->
                    <v-layout column wrap>
                        <v-flex md4 sm4></v-flex> <!-- User Question -->
                        <v-flex md4 sm4></v-flex> <!-- Patient Response -->
                        <v-flex md4 sm4></v-flex> <!-- User Response -->
                    </v-layout>
                </v-flex>
                <v-flex md3 sm3></v-flex> <!-- Transcript -->
                <v-flex md3 sm3></v-flex> <!-- Assessment (VSP) -->
                <v-flex md1 sm1></v-flex> <!-- User Perception -->
            </v-layout>
        </v-flex>
    </div>
</template>

<script>
export default {
    props : ['data'],

    methods : {
        processProps(){
            if(this.props.data){
                //Process the data here in right visual format
            }
        }
    }
}
</script>

<style>

</style>
