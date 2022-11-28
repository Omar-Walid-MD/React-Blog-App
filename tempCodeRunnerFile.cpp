#include <iostream>
using namespace std;


int* insertX(int n, int arr[], int x, int pos);
void insertY(int n, int arr[], int y, int pos);

void swapNums(int &x, int &y);


int main()
{

//Method 1: Assigning modified array to new pointer

    int arr1[] = {1,2,3,4,5,7,8,9,10};
    int *arr1New = insertX(8,arr1,6,6);

    //Calculate array size
    int s1 = sizeof(arr1)/sizeof(int)+1;

    //Traverse and print array
    cout << "Method 1 Array: (";
    for(int i = 0; i < s1;i++)
    {
        cout << arr1New[i];
        if(i<s1-1) cout << ", ";
    }
    cout << ")" << endl;

    //Output: (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)


//Method 2: Modifying existing array

    int arr2[] = {1,2,3,4,5,7,8,9,10};
    insertY(8,arr2,6,6);

    //Calculate array size
    int s2 = sizeof(arr2)/sizeof(int)+1;

    //Traverse and print array
    cout << "Method 2 Array: (";
    for(int i = 0; i < s2;i++)
    {
        cout << arr2[i];
        if(i<s2-1) cout << ", ";
    }
    cout << ")" << endl;

    //Output: (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

    int x = 1, y = 5;
    swapNums(x,y);
    cout << "x: " << x << "\ny: " << y;

}


int* insertX(int n, int arr[], int x, int pos)
{
    int i;
    n++;

    for(i=n;i>=pos;i--)
    {
        arr[i] = arr[i-1];
    }

    arr[pos-1] = x;

    return arr;
}

void insertY(int n, int &arr[], int y, int pos)
{
    int i;
    n++;

    for(i=n;i>=pos;i--)
    {
        arr[i] = arr[i-1];
    }

    arr[pos-1] = y;

}

void swapNums(int &x, int &y)
{
    int temp = x;
    x = y;
    y = temp;

}


