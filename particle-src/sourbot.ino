#include <math.h>
#include "SimpleTimer.h"

#define MOTOR_STBY     A4

#define ENABLE_MOTOR_A D0
#define IN1_MOTOR_A    A0
#define IN2_MOTOR_A    A1

#define ENABLE_MOTOR_B D1
#define IN1_MOTOR_B    A2
#define IN2_MOTOR_B    A3

#define SERVO_A        D2

#define VOLT_READ_SAMPLE_TIMES    10 //define how many samples you are going to take in normal operation
#define VOLT_READ_SAMPLE_INTERVAL 50 //define the time interval(in milisecond) between each samples in normal operation

#define CO2_PIN A5      //define which analog input channel you are going to use
#define CO2_DC_GAIN 8.5 //define the DC gain of amplifier

//These values differ from sensor to sensor. User should derermine this value.
#define CO2_ZERO_POINT_X       2.602 //lg400=2.602, the start point_on X_axis of the curve
#define CO2_ZERO_POINT_VOLTAGE 0.324 //define the output of the sensor in volts when the concentration of CO2 is 400PPM
#define CO2_MAX_POINT_VOLTAGE  0.265 //define the output of the sensor in volts when the concentration of CO2 is 10,000PPM
#define CO2_REACTION_VOLTGAE   0.059 //define the voltage drop of the sensor when move the sensor from air into 1000ppm CO2

#define CO2_UPDATE_INTERVAL 1000

#define PUBLISH_INTERVAL 120000

Servo servoA;
SimpleTimer timer;
float co2Curve[3] = {CO2_ZERO_POINT_X, CO2_ZERO_POINT_VOLTAGE, (CO2_REACTION_VOLTGAE / (2.602 - 4))};

String pH = "";
String co2 = "";
String volt = "";

void setup() {
  Serial1.begin(9600);
  pH.reserve(30);

  pinMode(MOTOR_STBY, OUTPUT);
  digitalWrite(MOTOR_STBY, HIGH);

  pinMode(ENABLE_MOTOR_A, OUTPUT);
  pinMode(IN1_MOTOR_A, OUTPUT);
  pinMode(IN2_MOTOR_A, OUTPUT);

  pinMode(ENABLE_MOTOR_B, OUTPUT);
  pinMode(IN1_MOTOR_B, OUTPUT);
  pinMode(IN2_MOTOR_B, OUTPUT);

  Particle.function("execute", execute);
  Particle.variable("pH", pH);
  Particle.variable("co2", co2);
  Particle.variable("volt", volt);

  timer.setInterval(CO2_UPDATE_INTERVAL, setCO2);
  timer.setInterval(PUBLISH_INTERVAL, publishData);
}

void loop() {
    timer.run();
}

void serialEvent1() {
  pH = Serial1.readStringUntil(13);
}

void publishData() {
    if (isdigit(pH[0])) {
        Particle.publish("pH", pH, PRIVATE);
    }
    if (isdigit(co2[0])) {
        Particle.publish("co2", co2, PRIVATE);
    }
    if (isdigit(volt[0])) {
        Particle.publish("volt", volt, PRIVATE);
    }
}

boolean execute(String argument) {
    String arg,val;
    arg = argument.substring(0, argument.indexOf(':'));
    val = argument.substring(argument.indexOf(':') + 1);

    Particle.publish("execute", argument, PRIVATE);

    if (strcmp(arg, "flour") == 0) {
        flour(val.toInt());
        return true;
    }
    else if (strcmp(arg, "water") == 0) {
        water(val.toInt());
        return true;
    }
    else if (strcmp(arg, "mix") == 0) {
        mix(val.toInt());
        return true;
    }

    return false;
}

void flour(int duration) {
    servoA.attach(SERVO_A);
    servoA.write(200);
    timer.setTimeout(duration, stopFlour);
}

void stopFlour() {
    servoA.detach();
}

void mix(int duration) {
    setMotorB(50, true);
    timer.setTimeout(duration, stopMix);
}

void stopMix() {
    setMotorB(0, true);
}

void water(int duration) {
    setMotorA(255, false);
    timer.setTimeout(duration, stopWater);
}

void stopWater() {
    setMotorA(0, false);
}

void setMotorA(int speed, boolean reverse) {
  analogWrite(ENABLE_MOTOR_A, speed);
  digitalWrite(IN1_MOTOR_A, ! reverse);
  digitalWrite(IN2_MOTOR_A, reverse);
}

void setMotorB(int speed, boolean reverse) {
  analogWrite(ENABLE_MOTOR_B, speed);
  digitalWrite(IN1_MOTOR_B, ! reverse);
  digitalWrite(IN2_MOTOR_B, reverse);
}

float getVolt(int pin) {
  int i;
  float v = 0;

  for (i = 0; i < VOLT_READ_SAMPLE_TIMES; i++) {
    v += analogRead(pin);
    delay(VOLT_READ_SAMPLE_INTERVAL);
  }

  v = (v / VOLT_READ_SAMPLE_TIMES) * 5 / 4095;
  return v;
}

int getCO2(float volts, float *pcurve) {
  volts = volts / CO2_DC_GAIN;
  if (volts > CO2_ZERO_POINT_VOLTAGE || volts < CO2_MAX_POINT_VOLTAGE ) {
    return -1;
  } else {
    return pow(10, (volts - pcurve[1]) / pcurve[2] + pcurve[0]);
    volts = 0;
  }
}

void setCO2() {
  float v = getVolt(CO2_PIN);
  volt = String(v, 3);
  co2 = String(getCO2(v, co2Curve));
}